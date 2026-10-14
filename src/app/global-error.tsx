'use client';

import React, { useEffect } from 'react';
import { reportClientError } from '@/lib/error-reporter';

// Replaces the whole root layout, so no Chakra provider is available here:
// the markup is plain on purpose.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    reportClientError('root-boundary', error);
  }, [error]);

  return (
    <html lang='es'>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Algo salió mal</h1>
          <p style={{ maxWidth: 420, margin: '0 auto 16px' }}>
            Ocurrió un error inesperado. Reintenta o recarga la página.
          </p>
          <button
            onClick={() => reset()}
            style={{
              border: '1px solid currentColor',
              borderRadius: 6,
              padding: '10px 20px',
              fontSize: 14,
              cursor: 'pointer',
              background: 'transparent',
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
