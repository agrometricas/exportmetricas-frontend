import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, useFormikContext } from 'formik';
import React, { useMemo } from 'react';
import LoadingState from '@/components/ui/states/LoadingState';
import ContractUsageTable from './ContractUsageTable';
import { useContractUsage } from '../../hooks/contract-usage/contractUsage';
import { startOfLocalDay } from '../../utils/dayMonthYear';
import { getWeekInfo } from '../../utils/getWeekInfo';
import { isCompleteDay } from '../purchase-order/schemas/purchaseOrder.schema';
import InputFieldDayDate from '../ui/form/InputFieldDayDate';

function WeekUsage(): React.JSX.Element {
  const { values } = useFormikContext<{ weekDay: string }>();
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const week = isCompleteDay(values.weekDay) ? values.weekDay : null;
  const { usage, isLoading } = useContractUsage(week);

  return (
    <Flex direction='column' gap={5}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        <InputFieldDayDate
          name='weekDay'
          label='Semana'
          helperText={
            week
              ? getWeekInfo({ date: new Date(week) }).week
              : 'Escribe cualquier día de la semana.'
          }
        />
      </SimpleGrid>
      <Text fontSize='sm' color={mutedColor}>
        Cuentan todas las cajas que cada finca exportó en la semana (de
        contrato, spot o sin orden de compra) contra las aprobadas por semana en
        su contrato vigente.
      </Text>
      {isLoading && <LoadingState />}
      {usage?.warnings.map((warning) => (
        <Alert key={warning} status='error' borderRadius='lg'>
          <AlertIcon />
          <AlertDescription fontSize='sm'>{warning}</AlertDescription>
        </Alert>
      ))}
      {usage && usage.farms.length === 0 && (
        <Text fontSize='sm' color={mutedColor}>
          Ninguna finca tiene contrato vigente ni exportaciones esa semana.
        </Text>
      )}
      {usage && usage.farms.length > 0 && (
        <ContractUsageTable farms={usage.farms} />
      )}
    </Flex>
  );
}

export default function ContractUsageView(): React.JSX.Element {
  const initialValues = useMemo(
    () => ({ weekDay: startOfLocalDay(new Date().toISOString()) }),
    []
  );
  return (
    <Formik initialValues={initialValues} onSubmit={() => undefined}>
      <WeekUsage />
    </Formik>
  );
}
