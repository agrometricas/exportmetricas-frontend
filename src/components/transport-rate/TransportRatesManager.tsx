import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Text,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
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
import { toaster } from '@/components/ui/toaster';
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
import { FormLabel } from '../ui/form/FormLabel';
import InputFieldPlain from '../ui/form/InputFieldPlain';

const ECUADOR = 'EC';

export default function TransportRatesManager(): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data = [] } = useTransportRates();
  const { paginationParams } = usePagination();
  const { data: countries } = useCountries(paginationParams);
  const ecuadorId = countries?.find((c) => c.code === ECUADOR)?.id;
  const { mutate: save, isPending: isLoading } = useSaveTransportRate();
  const { mutate: remove, isPending: isDeleting } = useDeleteTransportRate();
  const [editing, setEditing] = useState<TransportRateResponse | null>(null);
  const [toDelete, setToDelete] = useState<TransportRateResponse | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const showError = (error: unknown): void => {
    if (isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
      return;
    }
    toaster.create({
      title: 'No se pudo guardar la tarifa',
      description: serverErrorMessage(error),
      type: 'error',
      duration: 6000,
      closable: true,
    });
  };

  const done = (title: string): void => {
    toaster.create({ title, type: 'success', duration: 4000, closable: true });
    queryClient.invalidateQueries({
      queryKey: ['transportRates'],
    });
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
        header: 'Costo por contenedor',
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
          <HStack gap={2}>
            <Button
              size='sm'
              variant='outline'
              colorPalette='green'
              onClick={() => setEditing(row.original)}
            >
              Editar
            </Button>
            <Button
              size='sm'
              variant='ghost'
              colorPalette='red'
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
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
            {editing ? (
              <>
                <Box>
                  <FormLabel fontSize='sm'>Transportista</FormLabel>
                  <Input readOnly value={editing.transport.name} />
                </Box>
                <Box>
                  <FormLabel fontSize='sm'>Provincia</FormLabel>
                  <Input readOnly value={editing.province.name} />
                </Box>
              </>
            ) : (
              <>
                <InputFieldTransportSelect
                  name='transportId'
                  label='Transportista'
                  placeholder='Selecciona el transportista'
                />
                <InputFieldProvinceSelect
                  name='provinceId'
                  label='Provincia de la finca'
                  placeholder='Selecciona la provincia'
                  countryId={ecuadorId}
                />
              </>
            )}
            <InputFieldPlain
              name='costPerContainer'
              label='Costo por contenedor'
              placeholder='85.50'
              unit='USD/cont.'
              inputMode='decimal'
            />
          </SimpleGrid>
          <Text fontSize='sm' color='fg.muted' mt={2}>
            Un servicio por contenedor: del depósito o el puerto a la finca, y
            de la finca al puerto.
          </Text>
          <HStack mt={4}>
            <Button type='submit' colorPalette='green' loading={isLoading}>
              {editing ? 'Guardar cambios' : 'Agregar tarifa'}
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
                  Eliminar tarifa
                </Dialog.Header>
                <Dialog.Body>
                  Se eliminará la tarifa de {toDelete?.transport.name} para{' '}
                  {toDelete?.province.name}. Los pagos ya registrados no
                  cambian.
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
                        onError: showError,
                        onSuccess: () => done('Tarifa eliminada'),
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
