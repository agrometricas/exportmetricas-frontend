import { expect, test } from '@playwright/test';
import { DYNAMIC_ROUTES, dynamicRouteOf, STATIC_ROUTES } from './routes';
import { dashboardLinks, screenProblems } from './screen';

// A screen with an id in its URL is reached by following the links of the
// screens that list them: the first link found for each route.
const linked = new Map<string, string>();

async function collectLinks(
  page: Parameters<typeof dashboardLinks>[0]
): Promise<void> {
  for (const href of await dashboardLinks(page)) {
    const route = dynamicRouteOf(new URL(href, 'http://smoke').pathname);
    if (route && !linked.has(route)) linked.set(route, href);
  }
}

// Some screens open their subpages with a button (an export's edit and
// duplicate): build those URLs from the parent that was reached.
function deriveSubpages(): void {
  for (const { route } of DYNAMIC_ROUTES) {
    if (linked.has(route)) continue;
    for (const [parent, url] of linked) {
      const rest = route.slice(parent.length);
      if (route.startsWith(`${parent}/`) && !rest.includes('[')) {
        linked.set(route, `${new URL(url, 'http://smoke').pathname}${rest}`);
        break;
      }
    }
  }
}

test.describe('cada pantalla abre sin errores', () => {
  for (const route of STATIC_ROUTES) {
    test(route, async ({ page }) => {
      expect(await screenProblems(page, route)).toEqual([]);
      await collectLinks(page);
    });
  }

  test('las pantallas con id, siguiendo los enlaces', async ({ page }) => {
    test.setTimeout(DYNAMIC_ROUTES.length * 45_000);
    const visited = new Set<string>();
    const problems: string[] = [];

    // An opened screen can link to more (an export to its edit page).
    let pending = [...linked.keys()];
    while (pending.length > 0) {
      for (const route of pending) {
        visited.add(route);
        const url = linked.get(route) as string;
        await test.step(url, async () => {
          for (const problem of await screenProblems(page, url)) {
            problems.push(`${url}: ${problem}`);
          }
          await collectLinks(page);
        });
      }
      deriveSubpages();
      pending = [...linked.keys()].filter((route) => !visited.has(route));
    }

    const unreached = DYNAMIC_ROUTES.map(({ route }) => route).filter(
      (route) => !visited.has(route)
    );
    if (unreached.length > 0) {
      console.info(
        `Sin enlace en los datos de prueba: ${unreached.join(', ')}`
      );
    }
    expect(visited.size).toBeGreaterThan(0);
    expect(problems).toEqual([]);
  });
});
