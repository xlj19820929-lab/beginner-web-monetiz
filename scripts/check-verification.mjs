/**
 * Verifies the Google Search Console ownership meta tag is present in the
 * deployed HTML (no JavaScript execution — this is the raw first response).
 *
 * Usage: node scripts/check-verification.mjs [origin]
 */

const ORIGIN = process.argv[2] || 'https://beginner-web-monetiz.pages.dev';
const EXPECTED = '8_4FCogggJu4nB9ak35cMgyQwCsPWgDeBLCFs-p3Dfc';

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

let missing = 0;
let mismatched = 0;

for (const route of ROUTES) {
  const res = await fetch(`${ORIGIN}${route}`);
  const html = await res.text();

  // Match the meta tag regardless of attribute order.
  const tagMatch = html.match(/<meta[^>]*name=["']google-site-verification["'][^>]*>/i);
  const contentMatch = tagMatch
    ? tagMatch[0].match(/content=["']([^"']*)["']/i)
    : null;
  const content = contentMatch ? contentMatch[1] : '';

  if (!tagMatch) {
    missing += 1;
    console.log(`MISSING  ${route}`);
  } else if (content !== EXPECTED) {
    mismatched += 1;
    console.log(`WRONG    ${route}  content="${content}"`);
  } else {
    console.log(`OK       ${route}`);
  }
}

console.log('');
if (missing || mismatched) {
  console.log(`FAIL: ${missing} missing, ${mismatched} mismatched.`);
  process.exit(1);
}
console.log(`PASS: verification tag present and correct on all ${ROUTES.length} routes.`);
