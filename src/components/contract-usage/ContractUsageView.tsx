import { Alert, Flex, SimpleGrid, Text } from '@chakra-ui/react';
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
  const mutedColor = 'fg.muted';
  const week = isCompleteDay(values.weekDay) ? values.weekDay : null;
  const { usage, isLoading } = useContractUsage(week);

  return (
    <Flex direction='column' gap={5}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
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
        Las exportaciones de contrato usan los contenedores pactados con cada
        finca; las spot no. Contra el cupo del MAGAP cuentan todas las cajas que
        la finca exportó en la semana.
      </Text>
      {isLoading && <LoadingState />}
      {usage?.warnings.map((warning) => (
        <Alert.Root key={warning} status='error' borderRadius='lg'>
          <Alert.Indicator />
          <Alert.Description fontSize='sm'>{warning}</Alert.Description>
        </Alert.Root>
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
