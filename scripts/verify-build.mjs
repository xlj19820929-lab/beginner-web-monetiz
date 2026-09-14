import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = [
  'dist/index.html',
  'dist/about/index.html',
  'dist/contact/index.html',
  'dist/privacy-policy/index.html',
  'dist/terms/index.html',
  'dist/disclaimer/index.html',
  'dist/tools/password-generator/index.html',
  'dist/tools/word-counter/index.html',
  'dist/tools/unit-converter/index.html',
  'dist/tools/color-converter/index.html',
  'dist/tools/case-converter/index.html',
  'dist/tools/bmi-calculator/index.html',
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

  console.log(`${f.replace('/index.html', '').replace('dist', '') || '/'}`);
  console.log(`   ${title}`);
  console.log(`   canonical=${canonical}`);
  console.log(`   adMeta=${adMeta} adScript=${adScript} titles=${titleCount} canonicals=${canonicalCount}`);
  if (flags.length) console.log(`   !! ${flags.join(', ')}`);
  console.log('');
}

// Any other stray HTML output?
const extra = globSync('dist/**/*.html').filter((p) => !files.includes(p.replace(/\\/g, '/')));
if (extra.length) {
  console.log('Unexpected extra HTML files:', extra);
  problems += extra.length;
}

console.log(problems ? `\n${problems} problem(s) found.` : '\nAll static files clean.');
process.exit(problems ? 1 : 0);
