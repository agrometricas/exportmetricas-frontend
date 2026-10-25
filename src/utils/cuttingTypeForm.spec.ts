import { describe, expect, it } from 'vitest';
import {
  cuttingTypeBody,
  cuttingTypeFormValues,
  EMPTY_CUTTING_TYPE,
  optionsWithSaved,
} from './cuttingTypeForm';
import { CuttingType } from '../types/cuttingType';

const SAVED: CuttingType = {
  id: 30,
  createdAt: '',
  updatedAt: '',
  boxBrandId: 4,
  quality: 'Primera',
  shipmentType: 'Paletizado',
  leavesAtHarvest: 6,
  maxAgeAtCut: 12,
  minCaliber: 39,
  maxCaliber: 46,
  fingerLength: '9 pulgadas',
  saneos: '2',
  cunas: '2 a 4',
  clusterDetail: '4 a 6 dedos',
  labelDetail: '1 por clúster',
  firstLine: 'GRANDES CURVOS',
  secondLine: '',
  thirdLine: '',
  fourthLine: '',
  packagingPattern: 'CUATRO LINEAS',
  palletDetail: '48 cajas por pallet',
  cornerProtectorsDetail: 'Cuatro por pallet',
  reinforcementsDetail: 'Uno por pallet',
  plasticStrapsDetail: 'Cinco zunchos',
  staplesDetail: 'Dos por esquinero',
  blockingSheetsDetail: 'No aplica',
  transportDetail: 'Caja 10',
  generalObservations: null,
};

describe('formulario del tipo de corte', () => {
  it('el alta arranca vacío y sin revisar', () => {
    expect(EMPTY_CUTTING_TYPE.shipmentType).toBe('');
    expect(EMPTY_CUTTING_TYPE.minCaliber).toBe('');
    expect(EMPTY_CUTTING_TYPE.boxBrandId).toBe('');
    expect(EMPTY_CUTTING_TYPE.dataReviewed).toBe(false);
  });

  it('la edición arranca con lo guardado, y sin revisar', () => {
    const values = cuttingTypeFormValues(SAVED);
    expect(values).toMatchObject({
      boxBrandId: 4,
      shipmentType: 'Paletizado',
      minCaliber: '39',
      firstLine: 'GRANDES CURVOS',
      generalObservations: '',
      dataReviewed: false,
    });
  });

  it('manda los números como números y los textos sin espacios de sobra', () => {
    const body = cuttingTypeBody({
      ...cuttingTypeFormValues(SAVED),
      minCaliber: '40',
      saneos: ' 1 ',
      dataReviewed: true,
    });
    expect(body).toMatchObject({
      boxBrandId: 4,
      minCaliber: 40,
      maxCaliber: 46,
      saneos: '1',
      generalObservations: '',
    });
    expect(body).not.toHaveProperty('dataReviewed');
  });

  it('un valor guardado que no está en la lista se sigue ofreciendo', () => {
    const lines = [{ id: 'GRANDES CURVOS', name: 'GRANDES CURVOS' }];
    expect(optionsWithSaved(lines, 'Clústeres grandes')).toEqual([
      ...lines,
      { id: 'Clústeres grandes', name: 'Clústeres grandes' },
    ]);
    expect(optionsWithSaved(lines, 'GRANDES CURVOS')).toEqual(lines);
    expect(optionsWithSaved(lines, '')).toEqual(lines);
  });
});
