import { readdirSync } from 'node:fs';
import path from 'node:path';

const DASHBOARD = path.join(__dirname, '..', 'src', 'app', 'dashboard');

// Read from the app folder, so a new screen is covered without touching this
// file.
const PAGES = readdirSync(DASHBOARD, { recursive: true, encoding: 'utf8' })
  .filter((file) => path.basename(file) === 'page.tsx')
  .map((file) =>
    path
      .join('/dashboard', path.dirname(file))
      .split(path.sep)
      .join('/')
      .replace(/\/\.$/, '')
  )
  .sort();

export const STATIC_ROUTES = PAGES.filter((route) => !route.includes('['));

export const DYNAMIC_ROUTES = PAGES.filter((route) => route.includes('[')).map(
  (route) => ({
    route,
    pattern: new RegExp(`^${route.replace(/\[[^\]]+\]/g, '[^/]+')}$`),
  })
);

const STATIC = new Set(STATIC_ROUTES);

export function dynamicRouteOf(pathname: string): string | undefined {
  if (STATIC.has(pathname)) return undefined;
  return DYNAMIC_ROUTES.find(({ pattern }) => pattern.test(pathname))?.route;
}
