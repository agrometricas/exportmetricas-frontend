import {
  Box,
  Button,
  Flex,
  HStack,
  Table,
  Text,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import * as Yup from 'yup';
import LoadingState from '@/components/ui/states/LoadingState';
import { toaster } from '@/components/ui/toaster';
import { Tooltip } from '@/components/ui/tooltip';
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const borderColor = 'border';
  const mutedColor = 'fg.muted';
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
    toaster.create({
      title,
      description: serverErrorMessage(error),
      type: 'error',
      duration: 6000,
      closable: true,
    });
  };

  const done = (title: string): void => {
    toaster.create({ title, type: 'success', duration: 4000, closable: true });
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
              label='Tipo de caja'
              placeholder='22XU'
            />
          </Box>
          <Text fontSize='sm' color={mutedColor} mt={2}>
            Se guarda en mayúsculas. Cada alícuota elige uno al crearse o desde
            la lista de alícuotas.
          </Text>
          <HStack mt={4}>
            <Button type='submit' colorPalette='green' loading={isLoading}>
              {editing ? 'Guardar cambios' : 'Agregar tipo de caja'}
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
          <Table.Root size='sm'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Tipo de caja</Table.ColumnHeader>
                <Table.ColumnHeader textAlign='end'>
                  Alícuotas
                </Table.ColumnHeader>
                <Table.ColumnHeader />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {boxTypes.map((boxType) => (
                <Table.Row key={boxType.id}>
                  <Table.Cell fontWeight='semibold'>{boxType.name}</Table.Cell>
                  <Table.Cell textAlign='end'>{boxType.boxBrands}</Table.Cell>
                  <Table.Cell>
                    <HStack gap={2} justify='flex-end'>
                      <Button
                        size='sm'
                        variant='outline'
                        colorPalette='green'
                        onClick={() => setEditing(boxType)}
                      >
                        Renombrar
                      </Button>
                      <Tooltip
                        content='Lo usa al menos una alícuota'
                        disabled={boxType.boxBrands === 0}
                      >
                        <Button
                          size='sm'
                          variant='ghost'
                          colorPalette='red'
                          disabled={boxType.boxBrands > 0}
                          onClick={() => setToDelete(boxType)}
                        >
                          Eliminar
                        </Button>
                      </Tooltip>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      <Dialog.Root
        open={!!toDelete}
        initialFocusEl={() => cancelRef.current}
        role='alertdialog'
        onOpenChange={(e) => {
          if (!e.open) {
            setToDelete(null);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header fontSize='lg' fontWeight='bold'>
                  Eliminar tipo de caja
                </Dialog.Header>
                <Dialog.Body>
                  Se eliminará el tipo de caja {toDelete?.name}.
                </Dialog.Body>
                <Dialog.Footer>
                  <Button ref={cancelRef} onClick={() => setToDelete(null)}>
                    Volver
                  </Button>
                  <Button
                    colorPalette='red'
                    ml={3}
                    loading={isDeleting}
                    onClick={() => {
                      if (!toDelete) return;
                      remove(toDelete.id, {
                        onError: (error) =>
                          showError(
                            'No se pudo eliminar el tipo de caja',
                            error
                          ),
                        onSuccess: () => done('Tipo de caja eliminado'),
                      });
                      setToDelete(null);
                    }}
                  >
                    Eliminar
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Backdrop>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
}
