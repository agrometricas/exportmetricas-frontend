// A console.error in the browser never reaches Vercel's logs, so errors are
// posted to /api/client-errors and logged there. This must never throw, and it
// limits itself so a failing report cannot loop or flood.
const REPORT_ENDPOINT = '/api/client-errors';
const DEDUPE_WINDOW_MS = 60_000;
const MAX_REPORTS_PER_MINUTE = 10;
const MAX_TRACKED_MESSAGES = 100;

const recentReports = new Map<string, number>();
let windowStart = 0;
let windowCount = 0;

function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function reportClientError(
  source: string,
  error: unknown,
  context?: Record<string, unknown>
): void {
  try {
    if (typeof window === 'undefined') return;

    const message = toMessage(error).slice(0, 500);
    const dedupeKey = `${source}|${message}`;
    const now = Date.now();

    const lastSeen = recentReports.get(dedupeKey);
    if (lastSeen !== undefined && now - lastSeen < DEDUPE_WINDOW_MS) return;

    if (now - windowStart > DEDUPE_WINDOW_MS) {
      windowStart = now;
      windowCount = 0;
    }
    if (windowCount >= MAX_REPORTS_PER_MINUTE) return;

    recentReports.set(dedupeKey, now);
    windowCount += 1;
    if (recentReports.size > MAX_TRACKED_MESSAGES) {
      const oldest = recentReports.keys().next().value;
      if (oldest !== undefined) recentReports.delete(oldest);
    }

    // keepalive lets the report outlive a navigation or a closed tab.
    fetch(REPORT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source,
        message,
        stack: error instanceof Error ? error.stack?.slice(0, 4000) : undefined,
        digest: (error as { digest?: string } | null)?.digest,
        path: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        context,
      }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Reporting an error must never break the app.
  }
}
