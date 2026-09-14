import { createRoot } from 'react-dom/client';

let cache: ((path: string) => void) | null = null;

const container = document.getElementById('root')!;
const root = createRoot(container);

export function setRouter(fn: (path: string) => void) {
  cache = fn;
}

export function navigate(path: string) {
  if (path !== window.location.pathname) {
    window.history.pushState(null, '', path);
  }
  window.scrollTo(0, 0);
  cache?.(path);
}

window.addEventListener('popstate', () => {
  cache?.(window.location.pathname);
});

export function currentPath(): string {
  return window.location.pathname;
}

export { root };
