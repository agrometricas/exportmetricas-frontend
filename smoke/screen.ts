import { ConsoleMessage, Page, Response } from '@playwright/test';

// What goes wrong while a screen opens: a thrown error, an error in the
// console, a data request answered with 4xx or 5xx, the error screen, or a
// lost session.
export async function screenProblems(
  page: Page,
  url: string
): Promise<string[]> {
  const problems: string[] = [];
  const onPageError = (error: Error): void => {
    problems.push(`JS: ${error.message}`);
  };
  const onConsole = (message: ConsoleMessage): void => {
    // A failed request is reported below, with its URL.
    if (
      message.type() === 'error' &&
      !message.text().startsWith('Failed to load resource')
    ) {
      problems.push(`consola: ${message.text()}`);
    }
  };
  const onResponse = (response: Response): void => {
    const request = response.request();
    const isData = ['fetch', 'xhr'].includes(request.resourceType());
    if (isData && response.status() >= 400) {
      problems.push(
        `${request.method()} ${response.url()} → ${response.status()}`
      );
    }
  };

  page.on('pageerror', onPageError);
  page.on('console', onConsole);
  page.on('response', onResponse);
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    // Some pages redirect on purpose (the old logo uploads, a finished
    // onboarding); only losing the session counts.
    if (/\/auth\/signin/.test(page.url())) {
      problems.push('la sesión se perdió');
    }
    if ((await page.getByText('Algo salió mal').count()) > 0) {
      problems.push('mostró la pantalla de error');
    }
  } catch (error) {
    problems.push(`no abrió: ${(error as Error).message.split('\n')[0]}`);
  } finally {
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
    page.off('response', onResponse);
  }
  return problems;
}

export async function dashboardLinks(page: Page): Promise<string[]> {
  return page.$$eval('a[href^="/dashboard/"]', (anchors) =>
    anchors.map((anchor) => anchor.getAttribute('href') ?? '')
  );
}
