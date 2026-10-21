import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { withJsonErrorBody } from './blobError';
import { serverErrorMessage } from './serverErrorMessage';

const blobError = (body: string): AxiosError =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 409,
    statusText: 'Conflict',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: new Blob([body], { type: 'application/json' }),
  });

describe('error de una descarga', () => {
  it('lee el mensaje del backend aunque la respuesta venga como archivo', async () => {
    const error = await withJsonErrorBody(
      blobError(
        JSON.stringify({ statusCode: 409, message: 'Sin cobro registrado.' })
      )
    );

    expect(serverErrorMessage(error)).toBe('Sin cobro registrado.');
  });

  it('si el cuerpo no es JSON deja el error como estaba', async () => {
    const original = blobError('<html>');

    expect(await withJsonErrorBody(original)).toBe(original);
  });
});
