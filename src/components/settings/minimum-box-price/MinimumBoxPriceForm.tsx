import { Button, Flex, SimpleGrid, Text, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import LoadingState from '@/components/ui/states/LoadingState';
import {
  useMinimumBoxPrice,
  useUpdateMinimumBoxPrice,
} from '../../../hooks/settings/minimumBoxPrice';
import { MinimumBoxPriceResponse } from '../../../types/priceSheet';
import { isMoney } from '../../../utils/money';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import InputFieldPlain from '../../ui/form/InputFieldPlain';

type Values = { fasBoxPrice: string; fobBoxPrice: string };

const price = Yup.string()
  .required('Requerido')
  .test('dinero', 'Un número mayor que cero, con hasta dos decimales', isMoney);

const validationSchema = Yup.object({
  fasBoxPrice: price,
  fobBoxPrice: price,
});

export default function MinimumBoxPriceForm(): React.JSX.Element {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useMinimumBoxPrice();
  const { mutate: save, isLoading: isSaving } = useUpdateMinimumBoxPrice();
  const minimum = data as MinimumBoxPriceResponse | undefined;

  if (isLoading || !minimum) return <LoadingState />;

  const onSubmit = (values: Values): void => {
    save(
      {
        fasBoxPrice: Number(values.fasBoxPrice),
        fobBoxPrice: Number(values.fobBoxPrice),
      },
      {
        onError: (error) => {
          toast({
            title: 'No se pudo guardar el precio mínimo',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 6000,
            isClosable: true,
          });
        },
        onSuccess: () => {
          toast({
            title: 'Precio mínimo guardado',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries('minimumBoxPrice');
          queryClient.invalidateQueries('priceSheet');
          queryClient.invalidateQueries('priceSheetQuote');
          queryClient.invalidateQueries('export/producer-payment/quote');
        },
      }
    );
  };

  return (
    <Formik
      initialValues={{
        fasBoxPrice: minimum.fasBoxPrice,
        fobBoxPrice: minimum.fobBoxPrice,
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      enableReinitialize
    >
      <Form>
        <Flex flexDirection='column' gap={5}>
          <Text fontSize='sm' color='gray.500'>
            Es el precio por caja que se le propone al productor cuando la hoja
            semanal no tiene uno: el FAS a los productores con contrato FAS y el
            FOB a los demás.
            {minimum.isDefault &&
              ' Todavía no se ha guardado: rige el de 2026.'}
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
            <InputFieldPlain
              name='fasBoxPrice'
              label='FAS (al pie del barco)'
              inputMode='decimal'
              unit='USD por caja'
            />
            <InputFieldPlain
              name='fobBoxPrice'
              label='FOB (a bordo)'
              inputMode='decimal'
              unit='USD por caja'
            />
          </SimpleGrid>
          <Button type='submit' colorScheme='teal' isLoading={isSaving}>
            Guardar Precio Mínimo
          </Button>
        </Flex>
      </Form>
    </Formik>
  );
}
