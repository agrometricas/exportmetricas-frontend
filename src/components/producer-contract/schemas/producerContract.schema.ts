import * as Yup from 'yup';
import { ProducerContractResponse } from '../../../types/producerContract';
import { INVALID_DAY_DATE } from '../../ui/form/InputFieldDayDate';

export interface ValuesProps {
  merchantId: number | '';
  businessId: number | '';
  approvedHectares: number | '';
  approvedWeeklyBoxesPerHectare: number | '';
  contractType: '' | 'FAS' | 'FOB';
  startDate: string;
  endDate: string;
}

export const initialValues: ValuesProps = {
  merchantId: '',
  businessId: '',
  approvedHectares: '',
  approvedWeeklyBoxesPerHectare: '',
  contractType: '',
  startDate: '',
  endDate: '',
};

export function valuesFromContract(
  contract: ProducerContractResponse
): ValuesProps {
  return {
    merchantId: contract.business.merchant?.id ?? '',
    businessId: contract.business.id,
    approvedHectares: Number(contract.approvedHectares),
    approvedWeeklyBoxesPerHectare: contract.approvedWeeklyBoxesPerHectare,
    contractType: contract.contractType ?? '',
    startDate: contract.startDate,
    endDate: contract.endDate ?? '',
  };
}

const validDate = (value?: string): boolean =>
  !value || value !== INVALID_DAY_DATE;

export const validationSchema = Yup.object({
  businessId: Yup.number().required('Selecciona la finca'),
  approvedHectares: Yup.number()
    .typeError('Debe ser un número')
    .moreThan(0, 'Debe ser mayor que 0')
    .test(
      'dos-decimales',
      'Máximo dos decimales',
      (v) => v === undefined || /^\d+(\.\d{1,2})?$/.test(String(v))
    )
    .required('Requerido'),
  approvedWeeklyBoxesPerHectare: Yup.number()
    .typeError('Debe ser un número')
    .integer('Debe ser un número entero')
    .moreThan(0, 'Debe ser mayor que 0')
    .required('Requerido'),
  contractType: Yup.string().oneOf(['', 'FAS', 'FOB']),
  startDate: Yup.string()
    .required('Requerido')
    .test('fecha', 'Fecha inválida, use DD/MM/AAAA', validDate),
  endDate: Yup.string()
    .test('fecha', 'Fecha inválida, use DD/MM/AAAA', validDate)
    .test(
      'despues-del-inicio',
      'La fecha de fin no puede ser anterior a la de inicio',
      function (value) {
        const { startDate } = this.parent as ValuesProps;
        if (!value || !startDate || !validDate(value) || !validDate(startDate))
          return true;
        return new Date(value).getTime() >= new Date(startDate).getTime();
      }
    ),
});
