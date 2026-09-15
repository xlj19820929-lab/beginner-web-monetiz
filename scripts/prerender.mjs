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
 * Decide where Puppeteer should keep its browser.
 *
 * Two environments must both work:
 *
 *   Local (Windows dev box)
 *     The user relocated TEMP to F: so C: stops filling up. Puppeteer derives
 *     its default cache from TEMP, and a ~700 MB browser does not belong in a
 *     volatile per-session temp folder, so the browser lives on F:.
 *
 *   CI (Cloudflare Pages)
 *     There is no F: drive, and no browser is preinstalled, so Puppeteer's own
 *     default must be used and the browser downloaded during the build.
 *
 * The chosen directory is returned; the caller installs the browser there if
 * it is missing.
 */
function resolveCacheDir() {
  if (process.env.PUPPETEER_CACHE_DIR) return process.env.PUPPETEER_CACHE_DIR;

  // Only redirect on a machine that actually has the F: drive.
  if (process.platform === 'win32' && existsSync('F:\\')) {
    return 'F:\\Tools\\puppeteer-cache';
  }

  // Otherwise leave Puppeteer's default in place (CI / other platforms).
  return undefined;
}

const CACHE_DIR = resolveCacheDir();
if (CACHE_DIR) process.env.PUPPETEER_CACHE_DIR = CACHE_DIR;

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
 * Locate the Chrome binary Puppeteer uses.
 *
 * Passing `executablePath` explicitly sidesteps Puppeteer's cache resolution,
 * which some environments predefine to a per-session temp folder. The layout
 * differs per platform, so both are handled:
 *
 *   Windows  <root>/chrome/win64-<ver>/chrome-win64/chrome.exe
 *   Linux    <root>/chrome/linux-<ver>/chrome-linux64/chrome
 */
function findChromeExecutable() {
  const candidates = [
    process.env.PUPPETEER_CACHE_DIR,
    CACHE_DIR,
    process.platform === 'win32' ? 'F:\\Tools\\puppeteer-cache' : null,
    process.env.USERPROFILE ? join(process.env.USERPROFILE, '.cache', 'puppeteer') : null,
    process.env.HOME ? join(process.env.HOME, '.cache', 'puppeteer') : null,
  ].filter(Boolean);

  const isWin = process.platform === 'win32';
  const exeName = isWin ? 'chrome.exe' : 'chrome';
  const innerDirs = isWin
    ? ['chrome-win64', 'chrome-win32', join('chrome', 'win64'), join('chrome', 'win32'), '']
    : ['chrome-linux64', 'chrome-linux', join('chrome', 'linux64'), join('chrome', 'linux'), ''];

  for (const root of candidates) {
    const chromeDir = join(root, 'chrome');
    if (!existsSync(chromeDir)) continue;

    for (const versionDir of readdirSync(chromeDir)) {
      for (const inner of innerDirs) {
        const exe = join(chromeDir, versionDir, inner, exeName);
        if (existsSync(exe)) return exe;
      }
    }
  }
  return null;
}

/**
 * Ensure a browser is available, downloading it if necessary.
 *
 * Local builds reuse the browser already on F:. CI builds have no cache, so
 * Puppeteer is asked to fetch one; that download is cached by the platform
 * between builds when possible.
 */
async function ensureBrowser() {
  const existing = findChromeExecutable();
  if (existing) {
    console.log(`Using existing Chrome: ${existing}`);
    return existing;
  }

  console.log('No Chrome found; downloading via Puppeteer…');
  const browser = await puppeteer.install({ browser: 'chrome' });
  const installed = browser?.executablePath || findChromeExecutable();
  if (!installed) {
    throw new Error(
      'Puppeteer could not provide a Chrome build. ' +
        'Run `npx puppeteer browsers install chrome` and retry.'
    );
  }
  console.log(`Installed Chrome: ${installed}`);
  return installed;
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('dist/index.html not found — run `npm run build` first.');
    process.exit(1);
  }

  const chromePath = await ensureBrowser();

  const server = await startStaticServer();
  console.log(`Prerendering ${ROUTES.length} routes from http://127.0.0.1:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

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
