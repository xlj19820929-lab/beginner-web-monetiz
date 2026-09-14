/**
 * Pre-submission check for AdSense review.
 *
 * Verifies the advertising setup on the deployed site without executing
 * JavaScript, so it reflects what a reviewer (and Googlebot's first pass) sees.
 *
 * Usage: node scripts/check-adsense.mjs [origin]
 */

const ORIGIN = process.argv[2] || 'https://beginner-web-monetiz.pages.dev';
const PUB_ID = 'ca-pub-6410031165107651';
const PUB_ID_BARE = 'pub-6410031165107651';

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

/** Pages a reviewer is most likely to open. */
const CONTENT_ROUTES = ROUTES;

let problems = 0;
const note = (msg) => console.log(`   ${msg}`);

// 1. Verification meta tag on every route.
console.log('1. AdSense verification meta tag');
for (const route of ROUTES) {
  const res = await fetch(`${ORIGIN}${route}`);
  const html = await res.text();
  const tag = html.match(/<meta[^>]*name=["']google-adsense-account["'][^>]*>/i);
  const content = tag ? (tag[0].match(/content=["']([^"']*)["']/i) || [])[1] : '';
  if (content !== PUB_ID) {
    problems += 1;
    console.log(`   FAIL ${route} -> "${content || 'missing'}"`);
  }
}
if (problems === 0) console.log(`   OK on all ${ROUTES.length} routes (${PUB_ID})`);
console.log('');

// 2. ads.txt must be reachable and declare the publisher.
console.log('2. ads.txt');
{
  const res = await fetch(`${ORIGIN}/ads.txt`);
  const body = (await res.text()).trim();
  const ok = res.status === 200 && body.includes(PUB_ID_BARE) && /DIRECT/i.test(body);
  if (!ok) problems += 1;
  console.log(`   ${ok ? 'OK' : 'FAIL'} status=${res.status}`);
  note(`content: ${body || '(empty)'}`);
}
console.log('');

// 3. The ad library must NOT be baked into the static HTML.
//    Ads load only after consent, so a static loader would break that design.
console.log('3. No static AdSense loader (consent-first design intact)');
let loaderLeaks = 0;
for (const route of ROUTES) {
  const res = await fetch(`${ORIGIN}${route}`);
  const html = await res.text();
  const head = html.slice(0, html.indexOf('</head>'));
  if (/<script[^>]+adsbygoogle\.js/i.test(head) || /data-adsense-loader/.test(head)) {
    loaderLeaks += 1;
    console.log(`   FAIL ${route} contains a static ad loader in <head>`);
  }
}
if (loaderLeaks === 0) console.log('   OK — no static loader on any route');
else problems += loaderLeaks;
console.log('');

// 4. Content depth: reviewer-facing pages need real content, not thin stubs.
console.log('4. Content depth (visible text length per route)');
for (const route of CONTENT_ROUTES) {
  const res = await fetch(`${ORIGIN}${route}`);
  const html = await res.text();
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = body ? body.split(' ').length : 0;
  // Rough floor: policy pages and tools should carry meaningful copy.
  const ok = words > 150;
  if (!ok) problems += 1;
  console.log(`   ${ok ? 'OK  ' : 'THIN'} ${route.padEnd(30)} ~${words} words`);
}
console.log('');

// 5. Consent banner present, so the reviewer sees the required notice.
console.log('5. Consent / cookie notice present');
{
  const res = await fetch(`${ORIGIN}/`);
  const html = await res.text();
  const hasConsentCopy = /cookie/i.test(html) && /privacy/i.test(html);
  const hasGtag = /gtag\('consent',\s*'default'/.test(html.replace(/\s+/g, ' '));
  if (!hasConsentCopy) problems += 1;
  if (!hasGtag) problems += 1;
  console.log(`   ${hasConsentCopy ? 'OK' : 'FAIL'} cookie/privacy copy in HTML`);
  console.log(`   ${hasGtag ? 'OK' : 'FAIL'} Consent Mode v2 defaults in HTML`);
}
console.log('');

console.log(problems ? `${problems} problem(s) found.` : 'All AdSense pre-checks passed.');
process.exit(problems ? 1 : 0);
