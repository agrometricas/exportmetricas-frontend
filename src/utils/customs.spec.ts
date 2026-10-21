import { describe, expect, it } from 'vitest';
import { customsBody, customsChannelLabel } from './customs';

const EMPTY = {
  aucpNumber: '',
  aucpDate: '',
  daeNumber: '',
  daeDate: '',
  daeChannel: '' as const,
};

describe('AUCP y DAE de la exportación', () => {
  it('manda el registro completo, con lo vacío como null', () => {
    expect(
      customsBody({
        ...EMPTY,
        aucpNumber: ' AUCP-2026-0001 ',
        aucpDate: '2026-10-20T05:00:00.000Z',
      })
    ).toEqual({
      aucpNumber: 'AUCP-2026-0001',
      aucpDate: '2026-10-20T05:00:00.000Z',
      daeNumber: null,
      daeDate: null,
      daeChannel: null,
    });
  });

  it('un formulario vacío borra lo anotado', () => {
    expect(customsBody(EMPTY)).toEqual({
      aucpNumber: null,
      aucpDate: null,
      daeNumber: null,
      daeDate: null,
      daeChannel: null,
    });
  });

  it('rotula el canal de aforo en español', () => {
    expect(customsChannelLabel('PHYSICAL')).toBe('Físico intrusivo');
    expect(customsChannelLabel(null)).toBe('—');
  });
});
