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
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Text,
  useToast,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import {
  initialValues,
  transportRateBody,
  validationSchema,
  ValuesProps,
} from './transportRateBody';
import { useCountries } from '../../hooks/location/getCountries';
import { useTransportRates } from '../../hooks/transport-rate/getTransportRates';
import {
  useDeleteTransportRate,
  useSaveTransportRate,
} from '../../hooks/transport-rate/mutateTransportRate';
import { usePagination } from '../../hooks/usePagination';
import { TransportRateResponse } from '../../types/transportRate';
import { serverErrorMessage } from '../../utils/serverErrorMessage';
import InputFieldProvinceSelect from '../location/InputFieldProvinceSelect';
import InputFieldTransportSelect from '../transport/InputFiledTransportSelect';
import InputFieldPlain from '../ui/form/InputFieldPlain';

const ECUADOR = 'EC';

export default function TransportRatesManager(): React.JSX.Element {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data = [] } = useTransportRates();
  const { paginationParams } = usePagination();
  const { data: countries } = useCountries(paginationParams);
  const ecuadorId = countries?.find((c) => c.code === ECUADOR)?.id;
  const { mutate: save, isLoading } = useSaveTransportRate();
  const { mutate: remove, isLoading: isDeleting } = useDeleteTransportRate();
  const [editing, setEditing] = useState<TransportRateResponse | null>(null);
  const [toDelete, setToDelete] = useState<TransportRateResponse | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const showError = (error: unknown): void => {
    if (isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
      return;
    }
    toast({
      title: 'No se pudo guardar la tarifa',
      description: serverErrorMessage(error),
      status: 'error',
      duration: 6000,
      isClosable: true,
    });
  };

  const done = (title: string): void => {
    toast({ title, status: 'success', duration: 4000, isClosable: true });
    queryClient.invalidateQueries('transportRates');
    setEditing(null);
  };

  const onSubmit = (
    values: ValuesProps,
    { resetForm }: { resetForm: () => void }
  ): void => {
    save(
      {
        id: editing?.id,
        body: transportRateBody(values, { editing: !!editing }),
      },
      {
        onError: showError,
        onSuccess: () => {
          done(editing ? 'Tarifa actualizada' : 'Tarifa agregada');
          resetForm();
        },
      }
    );
  };

  const columns = useMemo<MRT_ColumnDef<TransportRateResponse>[]>(
    () => [
      { accessorKey: 'transport.name', header: 'Transportista', size: 200 },
      { accessorKey: 'province.name', header: 'Provincia', size: 160 },
      {
        accessorKey: 'costPerContainer',
        header: 'Costo por Contenedor',
        size: 170,
        Cell: ({ cell }): React.JSX.Element => (
          <span>${Number(cell.getValue<string>()).toFixed(2)}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 170,
        Cell: ({ row }): React.JSX.Element => (
          <HStack spacing={2}>
            <Button
              size='sm'
              variant='outline'
              colorScheme='green'
              onClick={() => setEditing(row.original)}
            >
              Editar
            </Button>
            <Button
              size='sm'
              variant='ghost'
              colorScheme='red'
              onClick={() => setToDelete(row.original)}
            >
              Eliminar
            </Button>
          </HStack>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data as TransportRateResponse[],
    enableColumnOrdering: false,
    enableColumnFilters: false,
    enableCellActions: false,
    enableDensityToggle: false,
    enableColumnDragging: false,
    enableHiding: false,
    layoutMode: 'grid',
    enableColumnActions: false,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      density: 'compact',
    },
    localization: MRT_Localization_ES,
  });

  return (
    <Flex direction='column' gap={6}>
      <Formik
        key={editing?.id ?? 'new'}
        initialValues={
          editing
            ? {
                transportId: editing.transport.id,
                provinceId: editing.province.id,
                costPerContainer: Number(editing.costPerContainer).toFixed(2),
              }
            : initialValues
        }
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <Text fontWeight='semibold' mb={3}>
            {editing ? 'Editar tarifa' : 'Agregar tarifa'}
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {editing ? (
              <>
                <Box>
                  <FormLabel fontSize='sm'>Transportista</FormLabel>
                  <Input isReadOnly value={editing.transport.name} />
                </Box>
                <Box>
                  <FormLabel fontSize='sm'>Provincia</FormLabel>
                  <Input isReadOnly value={editing.province.name} />
                </Box>
              </>
            ) : (
              <>
                <InputFieldTransportSelect
                  name='transportId'
                  label='Transportista'
                  placeholder='Seleccione el transportista'
                />
                <InputFieldProvinceSelect
                  name='provinceId'
                  label='Provincia de la Finca'
                  placeholder='Seleccione la provincia'
                  countryId={ecuadorId}
                />
              </>
            )}
            <InputFieldPlain
              name='costPerContainer'
              label='Costo por Contenedor'
              placeholder='85.50'
              unit='USD/cont.'
              inputMode='decimal'
            />
          </SimpleGrid>
          <Text fontSize='sm' color='gray.600' mt={2}>
            Un servicio por contenedor: del depósito o el puerto a la finca, y
            de la finca al puerto.
          </Text>
          <HStack mt={4}>
            <Button type='submit' colorScheme='teal' isLoading={isLoading}>
              {editing ? 'Guardar Cambios' : 'Agregar Tarifa'}
            </Button>
            {editing && (
              <Button variant='ghost' onClick={() => setEditing(null)}>
                Cancelar
              </Button>
            )}
          </HStack>
        </Form>
      </Formik>

      <MaterialReactTable table={table} />

      <AlertDialog
        isOpen={!!toDelete}
        leastDestructiveRef={cancelRef}
        onClose={() => setToDelete(null)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Eliminar tarifa
            </AlertDialogHeader>
            <AlertDialogBody>
              Se eliminará la tarifa de {toDelete?.transport.name} para{' '}
              {toDelete?.province.name}. Los pagos ya registrados no cambian.
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
                    onError: showError,
                    onSuccess: () => done('Tarifa eliminada'),
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
