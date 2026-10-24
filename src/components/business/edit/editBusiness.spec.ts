import { describe, expect, it } from 'vitest';
import {
  editBusinessBody,
  editBusinessSchema,
  valuesFromBusiness,
} from './editBusiness';
import { BusinessDetail } from '../../../types/merchant/businessDetail';

const business: BusinessDetail = {
  id: 50,
  name: 'Hacienda La Julia',
  merchant: { id: 3, businessName: 'Agrícola Paredes' },
  country: { id: 1, name: 'Ecuador' },
  province: { id: 9, name: 'El Oro' },
  city: null,
  address: null,
  fruitType: 'Convencional',
  area: 40,
  latitude: -3.2581,
  longitude: null,
  codeMAGAP: 'MAG0457',
  codeAGROCALIDAD: 'AGR9912',
  certificates: [{ certificate: { id: 12, name: 'GLOBALGAP' } }],
  businessCodes: [{ id: 70, code: 'LJ001' }],
  contacts: [
    {
      id: 80,
      name: 'Lucía Paredes',
      email: null,
      role: null,
      phone: '0991234567',
    },
  ],
};

describe('editar una finca', () => {
  it('el formulario arranca con lo guardado; lo que falta queda vacío', () => {
    expect(valuesFromBusiness(business)).toEqual({
      name: 'Hacienda La Julia',
      area: '40',
      fruitType: 'Convencional',
      codeMAGAP: 'MAG0457',
      codeAGROCALIDAD: 'AGR9912',
      countryId: 1,
      provinceId: 9,
      cityId: '',
      address: '',
      latitude: '-3.2581',
      longitude: '',
      certificates: [12],
      businessCodes: [{ id: 70, code: 'LJ001' }],
      contacts: [
        {
          id: 80,
          name: 'Lucía Paredes',
          role: '',
          email: '',
          phone: '0991234567',
        },
      ],
    });
  });

  it('manda los códigos y contactos con su id, los nuevos sin id, y lo vacío como null', () => {
    const values = valuesFromBusiness(business);
    const body = editBusinessBody({
      ...values,
      area: '42',
      businessCodes: [...values.businessCodes, { code: ' LJ002 ' }],
      contacts: [
        values.contacts[0],
        {
          name: ' Mario Paredes ',
          role: 'Capataz',
          email: '',
          phone: '0997654321',
        },
      ],
    });

    expect(body).toMatchObject({
      area: 42,
      countryId: 1,
      provinceId: 9,
      cityId: null,
      address: '',
      latitude: -3.2581,
      longitude: null,
      certificates: [12],
      businessCodes: [{ id: 70, code: 'LJ001' }, { code: 'LJ002' }],
      contacts: [
        {
          id: 80,
          name: 'Lucía Paredes',
          role: null,
          email: null,
          phone: '0991234567',
        },
        {
          name: 'Mario Paredes',
          role: 'Capataz',
          email: null,
          phone: '0997654321',
        },
      ],
    });
    expect(body.businessCodes?.[1]).not.toHaveProperty('id');
  });

  it('una finca guardada sin códigos ni contactos se edita sin mandarlos', () => {
    const body = editBusinessBody({
      ...valuesFromBusiness(business),
      businessCodes: [],
      contacts: [],
    });

    expect(body).not.toHaveProperty('businessCodes');
    expect(body).not.toHaveProperty('contacts');
  });

  it('acepta nombres con tildes, como los que ya vienen guardados', async () => {
    await expect(
      editBusinessSchema(business).validate(valuesFromBusiness(business))
    ).resolves.toBeTruthy();
  });

  it('rechaza una latitud fuera de rango y un teléfono mal escrito', async () => {
    const values = valuesFromBusiness(business);
    await expect(
      editBusinessSchema(business).validateAt('latitude', {
        ...values,
        latitude: '95',
      })
    ).rejects.toThrow('La latitud va entre -90 y 90');
    await expect(
      editBusinessSchema(business).validateAt('contacts[0].phone', {
        ...values,
        contacts: [{ ...values.contacts[0], phone: '12' }],
      })
    ).rejects.toThrow('Teléfono no válido');
  });
});
