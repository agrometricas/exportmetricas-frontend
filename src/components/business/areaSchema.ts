import * as Yup from 'yup';

// The backend stores up to two decimals and refuses more.
export const isHectares = (value: number | string | undefined): boolean =>
  value !== undefined &&
  /^\d+(\.\d{1,2})?$/.test(String(value).trim()) &&
  Number(value) > 0;

export const areaSchema = Yup.number()
  .typeError('Debe ser un número')
  .required('Requerido')
  .test('hectareas', 'Mayor que 0 y con hasta dos decimales', (value) =>
    isHectares(value)
  );
