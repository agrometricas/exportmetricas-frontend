import { Button, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import React from 'react';
import LoadingState from '@/components/ui/states/LoadingState';
import { toaster } from '@/components/ui/toaster';
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
  const queryClient = useQueryClient();
  const { data, isLoading } = useMaterialUnits();
  const { mutate: save, isPending: isSaving } = useUpdateMaterialUnits();
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
          toaster.create({
            title: 'No se pudieron guardar las unidades',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 6000,
            closable: true,
          });
        },
        onSuccess: () => {
          toaster.create({
            title: 'Unidades guardadas',
            type: 'success',
            duration: 5000,
            closable: true,
          });
          queryClient.invalidateQueries({
            queryKey: ['materialUnits']
          });
        },
      }
    );
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      <Form>
        <Flex flexDirection='column' gap={5}>
          <Text fontSize='sm' color='fg.muted'>
            Es la unidad en que la alícuota dice cuánto consume cada caja o cada
            contenedor. Se configura una vez; mientras tanto rige la unidad por
            defecto.
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
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
          <Button type='submit' colorPalette='green' loading={isSaving}>
            Guardar unidades
          </Button>
        </Flex>
      </Form>
    </Formik>
  );
}
