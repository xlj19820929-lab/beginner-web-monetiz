/**
 * Fetches deployed routes with plain HTTP (no JS execution) and reports the
 * SEO markers that Googlebot sees on its first crawl pass.
 *
 * Usage: node scripts/audit-live.mjs [origin]
 */

const ORIGIN = process.argv[2] || 'https://beginner-web-monetiz.pages.dev';

const ROUTES = [
  '/',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/disclaimer',
  '/tools/password-generator',
  '/tools/word-counter',
  '/tools/unit-converter',
  '/tools/color-converter',
  '/tools/case-converter',
  '/tools/bmi-calculator',
];

const expectedTitle = {
  '/': 'ToolKit',
  '/about': 'About Us',
  '/contact': 'Contact Us',
  '/privacy-policy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/disclaimer': 'Disclaimer',
  '/tools/password-generator': 'Password Generator',
  '/tools/word-counter': 'Word Counter',
  '/tools/unit-converter': 'Unit Converter',
  '/tools/color-converter': 'Color Converter',
  '/tools/case-converter': 'Case Converter',
  '/tools/bmi-calculator': 'BMI Calculator',
};

/** Routes that intentionally have no FAQ section (and therefore no FAQPage). */
const NO_FAQ_ROUTES = new Set(['/']);

let problems = 0;

for (const route of ROUTES) {
  const url = `${ORIGIN}${route}`;
  let html = '';
  let status = 0;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    status = res.status;
    html = await res.text();
  } catch (error) {
    console.log(`${route}\n   !! fetch failed: ${error.message}\n`);
    problems += 1;
    continue;
  }

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';

  const ldTags = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const types = [];
  let faqQuestions = 0;
  for (const m of ldTags) {
    try {
      const parsed = JSON.parse(m[1]);
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        types.push(node['@type']);
        if (node['@type'] === 'FAQPage') faqQuestions += (node.mainEntity || []).length;
      }
    } catch {
      types.push('INVALID_JSON');
    }
  }

  // Guardrails.
  const flags = [];
  if (status !== 200) flags.push(`status=${status}`);
  if (!title) flags.push('NO-TITLE');
  if (expectedTitle[route] && !title.includes(expectedTitle[route])) {
    flags.push(`WRONG-TITLE(want "${expectedTitle[route]}")`);
  }
  if (!canonical.endsWith(route === '/' ? '/' : route)) {
    flags.push(`BAD-CANONICAL(${canonical || 'none'})`);
  }
  if ((html.match(/<title>/g) || []).length > 1) flags.push('DUP-TITLE');
  if ((html.match(/rel="canonical"/g) || []).length > 1) flags.push('DUP-CANONICAL');
  if (!/google-adsense-account/.test(html)) flags.push('NO-AD-META');
  if (/adsbygoogle\.js/.test(html)) flags.push('AD-SCRIPT-IN-HTML');
  if (!NO_FAQ_ROUTES.has(route) && faqQuestions === 0) flags.push('NO-FAQ');
  if (flags.length) problems += 1;

  console.log(route);
  console.log(`   title     : ${title}`);
  console.log(`   canonical : ${canonical}`);
  console.log(`   desc      : ${desc ? desc.slice(0, 60) + '…' : '(none)'}`);
  console.log(`   jsonld    : [${types.join(', ')}]  faqQuestions=${faqQuestions}`);
  console.log(`   bytes     : ${html.length}`);
  if (flags.length) console.log(`   !! ${flags.join(' | ')}`);
  console.log('');
}

console.log(problems ? `${problems} route(s) with problems.` : 'All routes passed.');
process.exit(problems ? 1 : 0);
