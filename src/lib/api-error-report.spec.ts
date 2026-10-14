import { CanceledError } from 'axios';
import { describe, expect, it } from 'vitest';
import { describeApiError } from './api-error-report';

const request = { method: 'post', url: '/export/producer-payment' };

describe('qué errores de la API se reportan', () => {
  it('un 5xx, con método, ruta y lo que respondió el backend', () => {
    const report = describeApiError({
      message: 'Request failed with status code 500',
      config: request,
      response: {
        status: 500,
        data: { message: 'La operación createProducerPayment falló.' },
      },
    });

    expect(report).toEqual({
      source: 'api-5xx',
      message: 'Request failed with status code 500',
      context: {
        method: 'POST',
        apiPath: '/export/producer-payment',
        status: 500,
        backendMessage: 'La operación createProducerPayment falló.',
      },
    });
  });

  it('una petición sin respuesta: red caída o tiempo agotado', () => {
    const report = describeApiError({
      code: 'ECONNABORTED',
      message: 'timeout of 10000ms exceeded',
      config: { method: 'get', url: 'export/exports-sent' },
    });

    expect(report).toEqual({
      source: 'api-network',
      message: 'timeout of 10000ms exceeded',
      context: { method: 'GET', apiPath: 'export/exports-sent', status: null },
    });
  });

  it('un campo que el backend desplegado todavía no conoce', () => {
    const report = describeApiError({
      message: 'Request failed with status code 400',
      config: request,
      response: {
        status: 400,
        data: {
          message: 'Something bad happened',
          errors: [
            {
              property: 'discount',
              constraints: {
                whitelistValidation: 'property discount should not exist',
              },
            },
          ],
        },
      },
    });

    expect(report?.source).toBe('api-contract-mismatch');
    expect(report?.context.backendMessage).toContain(
      'property discount should not exist'
    );
  });

  it('la ruta se reporta sin su query, que puede llevar un token', () => {
    const report = describeApiError({
      message: 'Network Error',
      config: {
        method: 'post',
        url: '/public/weekly-adjustment?token=3f2b8c1e-5d47',
      },
    });

    expect(report?.context.apiPath).toBe('/public/weekly-adjustment');
  });

  it.each([
    [
      400,
      {
        message: 'Something bad happened',
        errors: 'El precio debe ser un número con máximo dos decimales.',
      },
    ],
    [401, { message: 'Unauthorized' }],
    [404, { message: 'No se encontró el envio de insumos' }],
    [409, { message: 'El RUC 0912345678001 ya está en uso.' }],
  ])('un %i es operación normal y no se reporta', (status, data) => {
    expect(
      describeApiError({
        message: 'x',
        config: request,
        response: { status, data },
      })
    ).toBeNull();
  });

  it('una petición cancelada al navegar no es un fallo', () => {
    expect(describeApiError(new CanceledError('canceled'))).toBeNull();
    expect(describeApiError({ code: 'ERR_CANCELED' })).toBeNull();
  });
});
