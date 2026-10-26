import { Button, Flex, SimpleGrid, Text, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { useQueryClient } from 'react-query';
import LoadingState from '@/components/ui/states/LoadingState';
import {
  useMaterialUnits,
  useUpdateMaterialUnits,
} from '../../../hooks/settings/materialUnits';
import { MaterialUnitsResponse } from '../../../types/materialUnits';
import {
  MATERIAL_TYPE_LABELS,
  MATERIAL_TYPE_ORDER,
} from '../../../utils/materialTypeLabels';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import InputFieldSelector from '../../ui/form/InputFieldSelector';

type Values = Record<string, string>;

export default function MaterialUnitsForm(): React.JSX.Element {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useMaterialUnits();
  const { mutate: save, isLoading: isSaving } = useUpdateMaterialUnits();
  const config = data as MaterialUnitsResponse | undefined;

  if (isLoading || !config) return <LoadingState />;

  const defaults = new Map(config.materials.map((m) => [m.materialType, m]));
  const initialValues: Values = Object.fromEntries(
    config.materials.map((m) => [m.materialType, m.unit])
  );
  const options = config.units.map((unit) => ({ name: unit, id: unit }));
  const types = MATERIAL_TYPE_ORDER.filter((type) => defaults.has(type));

  const onSubmit = (values: Values): void => {
    save(
      {
        units: types.map((materialType) => ({
          materialType,
          unit: values[materialType],
        })),
      },
      {
        onError: (error) => {
          toast({
            title: 'No se pudieron guardar las unidades',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 6000,
            isClosable: true,
          });
        },
        onSuccess: () => {
          toast({
            title: 'Unidades guardadas',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          queryClient.invalidateQueries('materialUnits');
        },
      }
    );
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      <Form>
        <Flex flexDirection='column' gap={5}>
          <Text fontSize='sm' color='gray.500'>
            Es la unidad en que la alícuota dice cuánto consume cada caja o cada
            contenedor. Se configura una vez; mientras tanto rige la unidad por
            defecto.
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
            {types.map((type) => (
              <InputFieldSelector
                key={type}
                name={type}
                label={`${MATERIAL_TYPE_LABELS[type] ?? type}${
                  defaults.get(type)?.isDefault ? ' (por defecto)' : ''
                }`}
                options={options}
              />
            ))}
          </SimpleGrid>
          <Button type='submit' colorScheme='teal' isLoading={isSaving}>
            Guardar Unidades
          </Button>
        </Flex>
      </Form>
    </Formik>
  );
}
