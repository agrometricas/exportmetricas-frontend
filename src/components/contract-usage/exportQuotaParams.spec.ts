import { describe, expect, it } from 'vitest';
import { exportQuotaParams } from './exportQuotaParams';
import { INVALID_DAY_DATE } from '../ui/form/InputFieldDayDate';

const WEDNESDAY = new Date(2026, 9, 21);

describe('revisión del cupo al llenar una exportación', () => {
  it('pide la semana de la fecha de corte con la finca y las cajas', () => {
    expect(
      exportQuotaParams({
        businessId: 5,
        cuttingDate: WEDNESDAY,
        boxQuantity: 1080,
      })
    ).toEqual({
      businessId: 5,
      cuttingDate: WEDNESDAY.toISOString(),
      boxQuantity: 1080,
    });
  });

  it('al editar manda la exportación, para no contarla dos veces', () => {
    expect(
      exportQuotaParams(
        { businessId: 5, cuttingDate: WEDNESDAY, boxQuantity: 1080 },
        40
      )
    ).toMatchObject({ exportId: 40 });
  });

  it('espera finca, un día completo y cajas', () => {
    const complete = { businessId: 5, cuttingDate: WEDNESDAY, boxQuantity: 1 };
    expect(exportQuotaParams({ ...complete, businessId: '' })).toBeNull();
    expect(exportQuotaParams({ ...complete, cuttingDate: '' })).toBeNull();
    expect(
      exportQuotaParams({ ...complete, cuttingDate: INVALID_DAY_DATE })
    ).toBeNull();
    expect(exportQuotaParams({ ...complete, boxQuantity: 0 })).toBeNull();
  });
});
