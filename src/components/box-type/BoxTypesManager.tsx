import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import LoadingState from '@/components/ui/states/LoadingState';
import { useBoxTypes } from '../../hooks/box-type/getBoxTypes';
import {
  useDeleteBoxType,
  useSaveBoxType,
} from '../../hooks/box-type/mutateBoxType';
import { BoxTypeResponse } from '../../types/boxType';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldPlain from '../ui/form/InputFieldPlain';

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Requerido')
    .max(30, 'Hasta 30 caracteres'),
});

export default function BoxTypesManager(): React.JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const { data, isLoading: isLoadingList } = useBoxTypes();
  const boxTypes = (data ?? []) as BoxTypeResponse[];
  const { mutate: save, isLoading } = useSaveBoxType();
  const { mutate: remove, isLoading: isDeleting } = useDeleteBoxType();
  const [editing, setEditing] = useState<BoxTypeResponse | null>(null);
  const [toDelete, setToDelete] = useState<BoxTypeResponse | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const showError = (title: string, error: unknown): void => {
    if (isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
      return;
    }
    toast({
      title,
      description: serverErrorMessage(error),
      status: 'error',
      duration: 6000,
      isClosable: true,
    });
  };

  const done = (title: string): void => {
    toast({ title, status: 'success', duration: 4000, isClosable: true });
    queryClient.invalidateQueries('boxTypes');
    queryClient.invalidateQueries('boxBrands');
    setEditing(null);
  };

  return (
    <Flex direction='column' gap={6}>
      <Formik
        key={editing?.id ?? 'new'}
        initialValues={{ name: editing?.name ?? '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) =>
          save(
            { id: editing?.id, body: { name: values.name.trim() } },
            {
              onError: (error) =>
                showError('No se pudo guardar el tipo de caja', error),
              onSuccess: () => {
                done(
                  editing ? 'Tipo de caja actualizado' : 'Tipo de caja agregado'
                );
                resetForm();
              },
            }
          )
        }
      >
        <Form>
          <Text fontWeight='semibold' mb={3}>
            {editing ? `Renombrar ${editing.name}` : 'Agregar tipo de caja'}
          </Text>
          <Box maxW='sm'>
            <InputFieldPlain
              name='name'
              label='Tipo de Caja'
              placeholder='22XU'
            />
          </Box>
          <Text fontSize='sm' color={mutedColor} mt={2}>
            Se guarda en mayúsculas. Cada alícuota elige uno al crearse o desde
            la lista de alícuotas.
          </Text>
          <HStack mt={4}>
            <Button type='submit' colorScheme='teal' isLoading={isLoading}>
              {editing ? 'Guardar Cambios' : 'Agregar Tipo de Caja'}
            </Button>
            {editing && (
              <Button variant='ghost' onClick={() => setEditing(null)}>
                Cancelar
              </Button>
            )}
          </HStack>
        </Form>
      </Formik>

      {isLoadingList && <LoadingState />}
      {!isLoadingList && boxTypes.length === 0 && (
        <Text fontSize='sm' color={mutedColor}>
          Todavía no hay tipos de caja.
        </Text>
      )}
      {boxTypes.length > 0 && (
        <Box
          overflowX='auto'
          borderWidth='1px'
          borderColor={borderColor}
          borderRadius='lg'
        >
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Tipo de Caja</Th>
                <Th isNumeric>Alícuotas</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {boxTypes.map((boxType) => (
                <Tr key={boxType.id}>
                  <Td fontWeight='semibold'>{boxType.name}</Td>
                  <Td isNumeric>{boxType.boxBrands}</Td>
                  <Td>
                    <HStack spacing={2} justify='flex-end'>
                      <Button
                        size='sm'
                        variant='outline'
                        colorScheme='green'
                        onClick={() => setEditing(boxType)}
                      >
                        Renombrar
                      </Button>
                      <Tooltip
                        label='Lo usa al menos una alícuota'
                        isDisabled={boxType.boxBrands === 0}
                      >
                        <Button
                          size='sm'
                          variant='ghost'
                          colorScheme='red'
                          isDisabled={boxType.boxBrands > 0}
                          onClick={() => setToDelete(boxType)}
                        >
                          Eliminar
                        </Button>
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <AlertDialog
        isOpen={!!toDelete}
        leastDestructiveRef={cancelRef}
        onClose={() => setToDelete(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Eliminar tipo de caja
            </AlertDialogHeader>
            <AlertDialogBody>
              Se eliminará el tipo de caja {toDelete?.name}.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setToDelete(null)}>
                Volver
              </Button>
              <Button
                colorScheme='red'
                ml={3}
                isLoading={isDeleting}
                onClick={() => {
                  if (!toDelete) return;
                  remove(toDelete.id, {
                    onError: (error) =>
                      showError('No se pudo eliminar el tipo de caja', error),
                    onSuccess: () => done('Tipo de caja eliminado'),
                  });
                  setToDelete(null);
                }}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
