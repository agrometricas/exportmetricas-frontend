import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { listTableOptions } from './listTableOptions';

const answered = (status: number, data: unknown): AxiosError =>
  new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  });

describe('estado de carga de una tabla', () => {
  it('en la primera carga muestra esqueletos, sin barra de progreso, y no deja ordenar', () => {
    expect(
      listTableOptions({ error: null, isLoading: true, isFetching: true })
    ).toEqual({
      enableSorting: false,
      muiToolbarAlertBannerProps: undefined,
      state: {
        isLoading: true,
        showAlertBanner: false,
        showProgressBars: false,
      },
    });
  });

  it('al volver a pedir una lista ya cargada deja las filas y muestra la barra de progreso', () => {
    expect(
      listTableOptions({ error: null, isLoading: false, isFetching: true })
        .state
    ).toEqual({
      isLoading: false,
      showAlertBanner: false,
      showProgressBars: true,
    });
  });

  it('con la lista cargada deja ordenar y no muestra esqueletos, barra ni aviso', () => {
    expect(
      listTableOptions({ error: null, isLoading: false, isFetching: false })
    ).toEqual({
      enableSorting: true,
      muiToolbarAlertBannerProps: undefined,
      state: {
        isLoading: false,
        showAlertBanner: false,
        showProgressBars: false,
      },
    });
  });

  it('si la petición falla avisa en la barra con el mensaje del servidor', () => {
    const options = listTableOptions({
      error: answered(403, {
        message: 'Esta acción le corresponde al área de Logística.',
      }),
      isLoading: false,
      isFetching: false,
    });

    expect(options.state.showAlertBanner).toBe(true);
    expect(options.muiToolbarAlertBannerProps).toEqual({
      color: 'error',
      children: 'Esta acción le corresponde al área de Logística.',
    });
  });

  it('si el servidor no responde dice que no hay conexión', () => {
    const options = listTableOptions({
      error: new AxiosError('Network Error', 'ERR_NETWORK'),
      isLoading: false,
      isFetching: false,
    });

    expect(options.muiToolbarAlertBannerProps?.children).toBe(
      'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.'
    );
  });

  it('si el servidor no explica el error dice que no se pudo cargar la lista', () => {
    expect(
      listTableOptions({
        error: answered(404, {}),
        isLoading: false,
        isFetching: false,
      }).muiToolbarAlertBannerProps?.children
    ).toBe('No se pudo cargar la lista');
  });
});
