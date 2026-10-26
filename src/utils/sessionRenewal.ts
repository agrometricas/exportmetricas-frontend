interface TokenLifetime {
  issuedAt: number;
  expiresAt: number;
}

function decodeSegment(segment: string): unknown {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '='
  );
  return JSON.parse(atob(padded));
}

export function tokenLifetime(jwt: string): TokenLifetime | null {
  try {
    const payload = decodeSegment(jwt.split('.')[1] ?? '') as {
      iat?: unknown;
      exp?: unknown;
    };
    if (typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
      return null;
    }
    return { issuedAt: payload.iat, expiresAt: payload.exp };
  } catch {
    return null;
  }
}

// Halfway through its life whatever the backend configures, so an active user
// always renews before the token expires.
export function needsRenewal(jwt: string, nowMs: number): boolean {
  const lifetime = tokenLifetime(jwt);
  if (!lifetime) return false;
  const halfway = (lifetime.issuedAt + lifetime.expiresAt) / 2;
  return nowMs / 1000 >= halfway;
}
