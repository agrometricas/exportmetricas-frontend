import { NextResponse } from 'next/server';

const MAX_BODY_LENGTH = 10_000;

// console.error on purpose: this runs on the server, and that is what puts the
// line in Vercel's function logs.
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const raw = (await request.text()).slice(0, MAX_BODY_LENGTH);
    const body = JSON.parse(raw);

    console.error(
      '[client-error]',
      JSON.stringify({
        source: body.source ?? 'unknown',
        message: body.message ?? '',
        path: body.path ?? '',
        digest: body.digest,
        context: body.context,
        timestamp: body.timestamp,
        userAgent: body.userAgent,
        stack: body.stack,
      })
    );
  } catch {
    // A malformed report is dropped: this route never fails toward the client.
  }
  return NextResponse.json({ ok: true });
}
