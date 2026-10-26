import { describe, expect, it } from 'vitest';
import { leavingTarget } from './leavingTarget';

const HERE = 'https://app.test/dashboard/export/add-export';
const click = (
  href: string,
  extra: Partial<{ opensElsewhere: boolean; modified: boolean }> = {}
): { href: string; opensElsewhere: boolean; modified: boolean } => ({
  href,
  opensElsewhere: false,
  modified: false,
  ...extra,
});

describe('salir de un formulario con cambios', () => {
  it('un enlace a otra pantalla de la app se pregunta antes de seguir', () => {
    expect(
      leavingTarget(click('https://app.test/dashboard/export/29/duplicate'), HERE)
    ).toBe('/dashboard/export/29/duplicate');
    expect(leavingTarget(click('/dashboard?semana=44#envios'), HERE)).toBe(
      '/dashboard?semana=44#envios'
    );
  });

  it('no pregunta si el clic se queda en la misma pantalla', () => {
    expect(leavingTarget(click(`${HERE}#cliente`), HERE)).toBeNull();
    expect(leavingTarget(null, HERE)).toBeNull();
  });

  it('no pregunta por lo que abre en otra pestaña ni por un clic con tecla', () => {
    expect(
      leavingTarget(click('/dashboard', { opensElsewhere: true }), HERE)
    ).toBeNull();
    expect(leavingTarget(click('/dashboard', { modified: true }), HERE)).toBeNull();
  });

  it('un sitio de afuera lo pregunta el navegador, no la app', () => {
    expect(leavingTarget(click('https://otro.test/'), HERE)).toBeNull();
  });
});
