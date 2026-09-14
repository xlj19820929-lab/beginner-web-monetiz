/**
 * Checks how the deployed host responds to trailing-slash and non-slash URLs,
 * including whether a redirect is issued and where it points.
 *
 * Usage: node scripts/audit-redirects.mjs [origin]
 */

const ORIGIN = process.argv[2] || 'https://beginner-web-monetiz.pages.dev';

const CASES = [
  '/',
  '/privacy-policy',
  '/privacy-policy/',
  '/about',
  '/about/',
  '/contact',
  '/contact/',
  '/terms',
  '/terms/',
  '/disclaimer',
  '/disclaimer/',
  '/tools/word-counter',
  '/tools/word-counter/',
  '/tools/bmi-calculator',
  '/tools/bmi-calculator/',
  '/totally-missing-page',
];

for (const path of CASES) {
  const url = `${ORIGIN}${path}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const status = res.status;
    const location = res.headers.get('location') || '';

    let detail = '';
    if (status === 200) {
      const html = await res.text();
      const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1];
      const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
      detail = `title="${title}"` + (h1 ? ` h1="${h1.replace(/<[^>]*>/g, '').trim().slice(0, 40)}"` : '');
    }

    const flag = status >= 300 && status < 400 ? '  <-- REDIRECT' : '';
    console.log(`${String(status).padEnd(4)} ${path.padEnd(30)} ${location || detail}${flag}`);
  } catch (error) {
    console.log(`ERR  ${path.padEnd(30)} ${error.message}`);
  }
}
