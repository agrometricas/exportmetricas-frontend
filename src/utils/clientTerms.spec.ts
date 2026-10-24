import { describe, expect, it } from 'vitest';
import { clientTermsBody } from './clientTerms';

describe('volumen de compra y plazo de pago del cliente', () => {
  it('manda las cajas y el plazo como números, con su unidad', () => {
    expect(
      clientTermsBody({
        purchaseVolumeBoxes: '100000',
        purchaseVolumePeriod: 'YEAR',
        paymentTermValue: '30',
        paymentTermUnit: 'DAY',
      })
    ).toEqual({
      purchaseVolumeBoxes: 100000,
      purchaseVolumePeriod: 'YEAR',
      paymentTermValue: 30,
      paymentTermUnit: 'DAY',
    });
  });

  it('un plazo de cero es contado, no un vacío', () => {
    expect(
      clientTermsBody({
        purchaseVolumeBoxes: '',
        purchaseVolumePeriod: '',
        paymentTermValue: '0',
        paymentTermUnit: 'DAY',
      })
    ).toEqual({
      purchaseVolumeBoxes: null,
      purchaseVolumePeriod: null,
      paymentTermValue: 0,
      paymentTermUnit: 'DAY',
    });
  });
});

describe('formulario del cliente', () => {
  it('el volumen y el plazo son opcionales, pero cada uno va con su unidad', async () => {
    const { validationSchema } = await import(
      '../components/settings/schemas/client.schema'
    );
    await expect(
      validationSchema.validateAt('purchaseVolumeBoxes', {
        purchaseVolumeBoxes: '',
      })
    ).resolves.toBeUndefined();
    await expect(
      validationSchema.validateAt('purchaseVolumePeriod', {
        purchaseVolumeBoxes: '100000',
        purchaseVolumePeriod: '',
      })
    ).rejects.toThrow('Elige el período');
    await expect(
      validationSchema.validateAt('paymentTermUnit', {
        paymentTermValue: '0',
        paymentTermUnit: '',
      })
    ).rejects.toThrow('Elige la unidad del plazo');
  });
});
