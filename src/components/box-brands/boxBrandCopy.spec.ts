import { describe, expect, it } from 'vitest';
import { boxBrandCopyValues, usedOptionalMaterials } from './boxBrandCopy';

const SAVED = {
  id: 11,
  name: 'Premium 22XU',
  brandCode: 'P22XU',
  brandId: 2,
  boxQuantity: 1080,
  netWeightBox: 41.5,
  grossWeightBox: 43,
  cargoType: 'CONTAINER',
  boxTypeId: 3,
  requiredCertificates: [{ id: 8, name: 'GlobalG.A.P.' }],
  bottomTypeId: 21,
  bottomTypeQuantity: 1,
  labelId: 31,
  labelQuantity: 18,
  bandId: null,
  bandQuantity: 0,
  securityKitId: null,
  securityKitQuantity: null,
  pesticideCocktail: [{ id: 1, quantity: 2, pesticide: { id: 3, name: 'X' } }],
  stickerCocktail: [],
};

describe('alícuota nueva a partir de otra', () => {
  it('copia materiales, cantidades y cócteles, sin el nombre ni el código', () => {
    const values = boxBrandCopyValues(SAVED);

    expect(values).toMatchObject({
      name: '',
      brandCode: '',
      brandId: 2,
      boxQuantity: 1080,
      netWeightBox: 41.5,
      requiredCertificates: [8],
      bottomTypeId: 21,
      labelId: 31,
      labelQuantity: 18,
      bandId: '',
      pesticides: [{ pesticideId: 3, quantity: 2 }],
      stickers: [],
      insecticides: [],
    });
  });

  it('una cantidad que nunca se guardó se copia como 0', () => {
    const values = boxBrandCopyValues(SAVED);

    expect(values.securityKitId).toBe('');
    expect(values.securityKitQuantity).toBe(0);
    expect(values.bandQuantity).toBe(0);
  });

  it('muestra abiertos los materiales opcionales que la alícuota lleva', () => {
    expect(usedOptionalMaterials(boxBrandCopyValues(SAVED))).toEqual([
      'labelId',
    ]);
    expect(usedOptionalMaterials({ labelId: '', bandId: 4 })).toEqual([
      'bandId',
    ]);
  });
});
