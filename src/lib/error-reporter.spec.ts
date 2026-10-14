import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';

type Report = typeof import('./error-reporter').reportClientError;

describe('reporte de errores del navegador', () => {
  let post: Mock;
  let reportClientError: Report;

  function sent(): Array<Record<string, unknown>> {
    return post.mock.calls.map(([, init]) => JSON.parse(init.body));
  }

  beforeEach(async () => {
    vi.useFakeTimers({ now: new Date('2025-06-04T15:00:00.000Z') });
    post = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', post);
    vi.stubGlobal('window', {
      location: { pathname: '/dashboard/liquidation/producer-payments' },
    });
    vi.stubGlobal('navigator', { userAgent: 'vitest' });
    // The limits are module state: a fresh copy for every test.
    vi.resetModules();
    ({ reportClientError } = await import('./error-reporter'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('manda el error a /api/client-errors con la pantalla donde ocurrió', () => {
    reportClientError('render-boundary', new Error('items is undefined'), {
      exportSentId: 41,
    });

    expect(post).toHaveBeenCalledWith(
      '/api/client-errors',
      expect.objectContaining({ method: 'POST', keepalive: true })
    );
    expect(sent()[0]).toMatchObject({
      source: 'render-boundary',
      message: 'items is undefined',
      path: '/dashboard/liquidation/producer-payments',
      userAgent: 'vitest',
      timestamp: '2025-06-04T15:00:00.000Z',
      context: { exportSentId: 41 },
    });
    expect(String(sent()[0].stack)).toContain('Error: items is undefined');
  });

  it('el mismo error no se repite dentro del mismo minuto', () => {
    reportClientError('api-5xx', 'Request failed with status code 500');
    reportClientError('api-5xx', 'Request failed with status code 500');
    expect(post).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60_000);
    reportClientError('api-5xx', 'Request failed with status code 500');
    expect(post).toHaveBeenCalledTimes(2);
  });

  it('no manda más de diez reportes por minuto, aunque sean distintos', () => {
    for (let i = 1; i <= 15; i++) {
      reportClientError('window-error', `fallo ${i}`);
    }
    expect(post).toHaveBeenCalledTimes(10);

    vi.advanceTimersByTime(60_001);
    reportClientError('window-error', 'fallo 16');
    expect(post).toHaveBeenCalledTimes(11);
  });

  it('nunca lanza, ni siquiera si el envío falla', () => {
    post.mockImplementation(() => {
      throw new Error('fetch no disponible');
    });

    expect(() => reportClientError('window-error', 'x')).not.toThrow();
  });

  it('no hace nada en el servidor, donde no hay ventana', () => {
    vi.stubGlobal('window', undefined);

    reportClientError('window-error', 'x');

    expect(post).not.toHaveBeenCalled();
  });
});
