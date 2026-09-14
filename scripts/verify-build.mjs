import { readFileSync, existsSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = [
  'dist/index.html',
  'dist/about.html',
  'dist/contact.html',
  'dist/privacy-policy.html',
  'dist/terms.html',
  'dist/disclaimer.html',
  'dist/tools/password-generator.html',
  'dist/tools/word-counter.html',
  'dist/tools/unit-converter.html',
  'dist/tools/color-converter.html',
  'dist/tools/case-converter.html',
  'dist/tools/bmi-calculator.html',
];

let problems = 0;

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));

  const title = (head.match(/<title>([^<]*)<\/title>/) || [])[1] || 'MISSING';
  const canonical = (head.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || 'MISSING';
  const adScript = /<script[^>]+adsbygoogle\.js/.test(head);
  const adMeta = /<meta name="google-adsense-account"/.test(head);

  // Duplicate-title check: index.html has a static <title> that applySeo also
  // writes, so a naively parsed file could end up with two.
  const titleCount = (head.match(/<title>/g) || []).length;
  const canonicalCount = (head.match(/rel="canonical"/g) || []).length;

  const flags = [];
  if (adScript) flags.push('AD-SCRIPT');
  if (!adMeta) flags.push('no-ad-meta');
  if (title === 'MISSING') flags.push('NO-TITLE');
  if (canonical === 'MISSING') flags.push('NO-CANONICAL');
  if (titleCount > 1) flags.push(`DUP-TITLE(${titleCount})`);
  if (canonicalCount > 1) flags.push(`DUP-CANONICAL(${canonicalCount})`);
  if (flags.length) problems += 1;

  console.log(`${f.replace('.html', '').replace('dist', '') || '/'}`);
  console.log(`   ${title}`);
  console.log(`   canonical=${canonical}`);
  console.log(`   adMeta=${adMeta} adScript=${adScript} titles=${titleCount} canonicals=${canonicalCount}`);
  if (flags.length) console.log(`   !! ${flags.join(', ')}`);
  console.log('');
}

// Cloudflare Pages serves 404.html (with a real 404 status) for unmatched
// requests. Without it the SPA fallback would answer missing URLs with 200 and
// a rendered "not found" view — a soft 404 that wastes crawl budget.
const notFoundPath = 'dist/404.html';
if (!existsSync(notFoundPath)) {
  console.log('!! dist/404.html is missing — unmatched URLs would return a soft 404.');
  problems += 1;
} else {
  const html = readFileSync(notFoundPath, 'utf8');
  const hasNoIndex = /name="robots"[^>]*noindex/i.test(html);
  const has404Copy = /Page not found/i.test(html);
  if (!hasNoIndex || !has404Copy) {
    console.log('!! dist/404.html is missing noindex or the "Page not found" copy.');
    problems += 1;
  } else {
    console.log('404.html present, noindex, and self-contained.');
  }
}
console.log('');

// Any other stray HTML output?
const extra = globSync('dist/**/*.html').filter(
  (p) => !files.includes(p.replace(/\\/g, '/')) && p.replace(/\\/g, '/') !== notFoundPath
);
if (extra.length) {
  console.log('Unexpected extra HTML files:', extra);
  problems += extra.length;
}

console.log(problems ? `\n${problems} problem(s) found.` : '\nAll static files clean.');
process.exit(problems ? 1 : 0);
