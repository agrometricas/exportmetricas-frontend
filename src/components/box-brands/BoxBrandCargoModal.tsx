import { Button, Flex, Text, Dialog, Portal } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
import { toaster } from '@/components/ui/toaster';
import { useBoxTypes } from '../../hooks/box-type/getBoxTypes';
import { useUpdateBoxBrandCargo } from '../../hooks/box-type/mutateBoxType';
import { BoxTypeResponse, CargoType } from '../../types/boxType';
import { cargoBody, CARGO_TYPE_OPTIONS } from '../../utils/cargoType';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldSelector from '../ui/form/InputFieldSelector';

export type CargoTarget = {
  id: number;
  name: string;
  cargoType?: CargoType;
  boxType?: { id: number; name: string } | null;
};

export default function BoxBrandCargoModal({
  boxBrand,
  onClose,
}: {
  boxBrand: CargoTarget | null;
  onClose: () => void;
}): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useBoxTypes();
  const options = ((data ?? []) as BoxTypeResponse[]).map(({ id, name }) => ({
    id,
    name,
  }));
  const { mutate: save, isLoading } = useUpdateBoxBrandCargo();

  return (
    <Dialog.Root
      open={!!boxBrand}
      placement='center'
      onOpenChange={(e) => {
        if (!e.open) {
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {boxBrand && (
              <Formik
                initialValues={{
                  cargoType: boxBrand.cargoType ?? 'CONTAINER',
                  boxTypeId: boxBrand.boxType?.id ?? '',
                }}
                onSubmit={(values) =>
                  save(
                    { boxBrandId: boxBrand.id, body: cargoBody(values) },
                    {
                      onError: (error) => {
                        if (
                          isAxiosError(error) &&
                          error.response?.status === 401
                        ) {
                          router.push('/api/auth/signout');
                          return;
                        }
                        toaster.create({
                          title: 'No se pudo guardar',
                          description: serverErrorMessage(error),
                          type: 'error',
                          duration: 6000,
                          closable: true,
                        });
                      },
                      onSuccess: () => {
                        toaster.create({
                          title: 'Alícuota actualizada',
                          type: 'success',
                          duration: 4000,
                          closable: true,
                        });
                        queryClient.invalidateQueries('boxBrands');
                        queryClient.invalidateQueries('boxTypes');
                        onClose();
                      },
                    }
                  )
                }
              >
                <Form>
                  <Dialog.Header>
                    Carga y tipo de caja de {boxBrand.name}
                  </Dialog.Header>
                  <Dialog.CloseTrigger />
                  <Dialog.Body>
                    <Flex direction='column' gap={4}>
                      <InputFieldSelector
                        name='cargoType'
                        label='Tipo de Carga'
                        options={CARGO_TYPE_OPTIONS}
                      />
                      <InputFieldSelector
                        name='boxTypeId'
                        label='Tipo de Caja'
                        placeholder='Sin tipo de caja'
                        options={options}
                      />
                      <Text fontSize='sm' color='gray.600'>
                        Una alícuota con pallets o mini pallets no puede pasar a
                        granel.
                      </Text>
                    </Flex>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button
                      type='submit'
                      colorPalette='green'
                      loading={isLoading}
                    >
                      Guardar
                    </Button>
                  </Dialog.Footer>
                </Form>
              </Formik>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
