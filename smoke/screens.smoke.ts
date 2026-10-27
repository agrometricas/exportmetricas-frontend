import { readdirSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const DASHBOARD = path.join(__dirname, '..', 'src', 'app', 'dashboard');

// Every page of the dashboard without a dynamic segment, read from the app
// folder so a new screen is covered without touching this file.
const ROUTES = readdirSync(DASHBOARD, { recursive: true, encoding: 'utf8' })
  .filter((file) => path.basename(file) === 'page.tsx' && !file.includes('['))
  .map((file) =>
    path
      .join('/dashboard', path.dirname(file))
      .split(path.sep)
      .join('/')
      .replace(/\/\.$/, '')
  )
  .sort();

test.describe('cada pantalla abre sin errores', () => {
  for (const route of ROUTES) {
    test(route, async ({ page }) => {
      const problems: string[] = [];
      page.on('pageerror', (error) => problems.push(`JS: ${error.message}`));
      page.on('console', (message) => {
        // A failed request is reported below, with its URL.
        if (
          message.type() === 'error' &&
          !message.text().startsWith('Failed to load resource')
        ) {
          problems.push(`consola: ${message.text()}`);
        }
      });
      page.on('response', (response) => {
        const request = response.request();
        const isData = ['fetch', 'xhr'].includes(request.resourceType());
        if (isData && response.status() >= 400) {
          problems.push(
            `${request.method()} ${response.url()} → ${response.status()}`
          );
        }
      });

      await page.goto(route, { waitUntil: 'networkidle' });

      // Some pages redirect on purpose (the old logo uploads, a finished
      // onboarding); only losing the session counts.
      await expect(page).not.toHaveURL(/\/auth\/signin/);
      await expect(page.getByText('Algo salió mal')).toHaveCount(0);
      expect(problems).toEqual([]);
    });
  }
});
