import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { serverErrorMessage } from './serverErrorMessage';

const answered = (status: number, data: unknown): AxiosError =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  });

describe('mensaje de un error del servidor', () => {
  it('en un 400 lee el detalle de errors, no el texto genérico', () => {
    expect(
      serverErrorMessage(
        answered(400, {
          message: 'Something bad happened',
          errors: 'La finca no existe para esta exportadora.',
        })
      )
    ).toBe('La finca no existe para esta exportadora.');
    expect(
      serverErrorMessage(
        answered(400, {
          message: 'Something bad happened',
          errors: [
            { constraints: { isInt: 'Las cajas deben ser un número.' } },
          ],
        })
      )
    ).toBe('Las cajas deben ser un número.');
  });

  it('en los demás lee el mensaje del backend', () => {
    expect(
      serverErrorMessage(
        answered(409, { message: 'La exportación 40 está cancelada.' })
      )
    ).toBe('La exportación 40 está cancelada.');
  });

  it('el 500 genérico de Nest se dice en español', () => {
    expect(
      serverErrorMessage(answered(500, { message: 'Internal server error' }))
    ).toBe('El servidor tuvo un problema. Inténtalo de nuevo en un momento.');
  });

  it('sin respuesta dice si no hubo conexión o si tardó demasiado', () => {
    expect(
      serverErrorMessage(new AxiosError('Network Error', 'ERR_NETWORK'))
    ).toBe(
      'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.'
    );
    expect(
      serverErrorMessage(
        new AxiosError('timeout of 10000ms exceeded', 'ECONNABORTED')
      )
    ).toBe('El servidor tardó demasiado en responder. Inténtalo de nuevo.');
  });
});
