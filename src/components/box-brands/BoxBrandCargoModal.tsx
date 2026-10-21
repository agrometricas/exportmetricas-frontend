import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from 'react-query';
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
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useBoxTypes();
  const options = ((data ?? []) as BoxTypeResponse[]).map(({ id, name }) => ({
    id,
    name,
  }));
  const { mutate: save, isLoading } = useUpdateBoxBrandCargo();

  return (
    <Modal isOpen={!!boxBrand} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
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
                    if (isAxiosError(error) && error.response?.status === 401) {
                      router.push('/api/auth/signout');
                      return;
                    }
                    toast({
                      title: 'No se pudo guardar',
                      description: serverErrorMessage(error),
                      status: 'error',
                      duration: 6000,
                      isClosable: true,
                    });
                  },
                  onSuccess: () => {
                    toast({
                      title: 'Alícuota actualizada',
                      status: 'success',
                      duration: 4000,
                      isClosable: true,
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
              <ModalHeader>Carga y tipo de caja de {boxBrand.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
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
              </ModalBody>
              <ModalFooter>
                <Button variant='ghost' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button type='submit' colorScheme='teal' isLoading={isLoading}>
                  Guardar
                </Button>
              </ModalFooter>
            </Form>
          </Formik>
        )}
      </ModalContent>
    </Modal>
  );
}
