/**
 * Build-time prerenderer.
 *
 * The site is a client-rendered React SPA: `<title>`, the meta description,
 * the canonical link and every JSON-LD block are written by `applySeo()` from a
 * `useEffect`, i.e. only after JavaScript has run. Googlebot's first crawl
 * pass does not run JavaScript, so it saw the same homepage title on all 12
 * routes and no structured data at all.
 *
 * This script loads each route in a headless browser, waits for React to
 * settle, and writes the resulting HTML to a per-route static file. Cloudflare
 * Pages then serves those files directly, so the first HTML response already
 * contains the correct metadata — no JavaScript required.
 *
 * Usage:  node scripts/prerender.mjs        (expects `dist/` to be built)
 */

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = 4319;

/**
 * Pin Puppeteer's browser cache to a stable path, BEFORE Puppeteer is imported.
 *
 * ES module imports are hoisted, so `import puppeteer` would run before any
 * statement below it. Puppeteer therefore has to be pulled in with a dynamic
 * import after this block, otherwise it reads the ambient PUPPETEER_CACHE_DIR
 * — which points at a per-session sandbox temp folder — and fails to find the
 * browser.
 *
 * Why this matters: the user relocated TEMP to F: to stop C: filling up, and
 * Puppeteer derives its default cache from TEMP. A ~700 MB browser download
 * does not belong in a volatile temp directory, so it lives on F: instead.
 *
 * Set PUPPETEER_CACHE_DIR in the environment to override.
 */
const PUPPETEER_CACHE = process.env.PUPPETEER_CACHE_DIR || 'F:\\Tools\\puppeteer-cache';
process.env.PUPPETEER_CACHE_DIR = PUPPETEER_CACHE;

const { default: puppeteer } = await import('puppeteer');

/** Every route that gets its own static HTML file. */
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

/**
 * Hosts that must never be contacted during prerendering.
 *
 * AdSense is the important one: the site deliberately loads it only after the
 * visitor grants consent. Prerendering must not bake the advertising script
 * into the static HTML, so the request is blocked outright.
 */
const BLOCKED_HOSTS = [
  'pagead2.googlesyndication.com',
  'googletagservices.com',
  'googleads.g.doubleclick.net',
  'google-analytics.com',
  'googletagmanager.com',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

/**
 * Minimal static file server for `dist/`.
 *
 * `vite preview` would also work, but serving the files ourselves keeps the
 * prerender step free of Vite's SPA fallback: we only ever want the raw
 * `index.html` shell, never a fallback that could mask a missing asset.
 */
function startStaticServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = join(DIST, urlPath);

      // Directory or root request -> serve the SPA shell.
      if (urlPath === '/' || !extname(filePath)) {
        filePath = join(DIST, 'index.html');
      }

      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

/**
 * Where a route's HTML file lives inside `dist/`.
 *
 * Cloudflare Pages treats a `route/index.html` pair as a *directory*, and
 * redirects `/route` to `/route/` with a trailing slash. The site's router does
 * exact string matching, so that redirect produced "Page not found" on every
 * prerendered page. Writing `route.html` instead makes Cloudflare serve the
 * file at the exact requested path, with no redirect.
 */
function outputPathFor(route) {
  return route === '/'
    ? join(DIST, 'index.html')
    : join(DIST, `${route.replace(/^\//, '')}.html`);
}

/**
 * Locate the Chrome binary that Puppeteer downloaded.
 *
 * Puppeteer resolves its cache from `PUPPETEER_CACHE_DIR`, but some
 * environments (CI sandboxes, the editor's own tooling) predefine that variable
 * to a per-session temp folder and override any value set here. Passing
 * `executablePath` explicitly sidesteps that resolution entirely, which also
 * keeps the ~700 MB browser out of a volatile temp directory.
 */
function findChromeExecutable() {
  const candidates = [
    process.env.PUPPETEER_CACHE_DIR,
    'F:\\Tools\\puppeteer-cache',
    join(process.env.USERPROFILE || '', '.cache', 'puppeteer'),
  ].filter(Boolean);

  for (const root of candidates) {
    const chromeDir = join(root, 'chrome');
    if (!existsSync(chromeDir)) continue;

    // Layout: <root>/chrome/win64-<version>/chrome-win64/chrome.exe
    for (const versionDir of readdirSync(chromeDir)) {
      for (const inner of ['chrome-win64', 'chrome-win32', join('chrome', 'win64'), join('chrome', 'win32')]) {
        const exe = join(chromeDir, versionDir, inner, 'chrome.exe');
        if (existsSync(exe)) return exe;
      }
      const direct = join(chromeDir, versionDir, 'chrome.exe');
      if (existsSync(direct)) return direct;
    }
  }
  return null;
}

const CHROME_EXECUTABLE = findChromeExecutable();

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('dist/index.html not found — run `npm run build` first.');
    process.exit(1);
  }

  const server = await startStaticServer();
  console.log(`Prerendering ${ROUTES.length} routes from http://127.0.0.1:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    ...(CHROME_EXECUTABLE ? { executablePath: CHROME_EXECUTABLE } : {}),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  if (!CHROME_EXECUTABLE) {
    console.warn(
      'Warning: no pinned Chrome found; relying on Puppeteer default resolution.'
    );
  }

  let failures = 0;

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();

      // Block advertising and analytics so nothing third-party ends up in the
      // static output, and so prerendering needs no outside network access.
      await page.setRequestInterception(true);
      page.on('request', (request) => {
        const host = (() => {
          try {
            return new URL(request.url()).hostname;
          } catch {
            return '';
          }
        })();
        if (BLOCKED_HOSTS.some((blocked) => host.endsWith(blocked))) {
          request.abort();
          return;
        }
        request.continue();
      });

      // Suppress the cookie banner: a first-time visitor has not chosen yet,
      // and the banner is irrelevant to the prerendered metadata.
      await page.evaluateOnNewDocument(() => {
        try {
          window.localStorage.setItem('toolkit-cookie-consent', 'rejected');
        } catch {
          /* storage unavailable — the banner may render, which is harmless */
        }
      });

      const url = `http://127.0.0.1:${PORT}${route}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // `useEffect` runs after paint, so wait for the metadata it writes.
      await page.waitForFunction(
        () => {
          const canonical = document.querySelector('link[rel="canonical"]');
          return !!canonical && !!canonical.getAttribute('href');
        },
        { timeout: 15000 }
      );

      const html = await page.content();
      const outPath = outputPathFor(route);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, 'utf8');

      // Report what the prerendered file actually contains.
      const title = await page.title();
      const schemaTypes = await page.evaluate(() =>
        Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
          .flatMap((script) => {
            try {
              const parsed = JSON.parse(script.textContent || '');
              const list = Array.isArray(parsed) ? parsed : [parsed];
              return list.map((node) => node['@type']);
            } catch {
              return ['INVALID_JSON'];
            }
          })
          .filter(Boolean)
          .join(',')
      );

      // `loadAdSense()` must not have run. The static verification tag in
      // index.html is expected and carries `data-adsense-loader`-free markup,
      // so look specifically for the runtime-injected loader.
      const leakedAdSense = /data-adsense-loader/.test(html);
      console.log(
        `  ${route.padEnd(31)} title="${title}" schema=[${schemaTypes}]` +
          (leakedAdSense ? '  !! runtime AdSense loader leaked into output' : '')
      );

      if (leakedAdSense) failures += 1;
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures > 0) {
    console.error(`\nPrerender finished with ${failures} problem(s).`);
    process.exit(1);
  }
  console.log('\nPrerender complete.');
}

main().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
