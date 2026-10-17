import { Button, Text, VStack } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Link_Next from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { useBookings } from '../../hooks/booking/getBookings';
import { BookingResponse } from '../../types/booking';
import {
  formatDayMonthYear,
  formatDayMonthYearTime,
} from '../../utils/dayMonthYear';

const money = (value: string): string => `$${Number(value).toFixed(2)}`;

const TableBookings = (): React.JSX.Element => {
  const { data = [], error } = useBookings();
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<BookingResponse>[]>(
    () => [
      {
        header: 'Reserva',
        columns: [
          { accessorKey: 'bookingNumber', size: 105, header: 'Booking' },
          {
            accessorKey: 'shippingCompany.name',
            size: 100,
            header: 'Naviera',
          },
          { accessorKey: 'shipName', size: 105, header: 'Nave' },
          {
            id: 'route',
            size: 160,
            header: 'Ruta',
            accessorFn: (row) =>
              `${row.harborDeparture.name} → ${row.harborDestination.name}`,
          },
        ],
      },
      {
        header: 'Zarpe y Llegada',
        columns: [
          {
            accessorKey: 'etd',
            size: 130,
            header: 'ETD',
            Cell: ({ cell }): React.JSX.Element => (
              <span>{formatDayMonthYearTime(cell.getValue<string>())}</span>
            ),
          },
          {
            accessorKey: 'eta',
            size: 125,
            header: 'ETA',
            Cell: ({ cell }): React.JSX.Element => (
              <span>
                {formatDayMonthYear(cell.getValue<string | null>()) || '—'}
              </span>
            ),
          },
        ],
      },
      {
        header: 'Contenedores y Flete',
        columns: [
          {
            id: 'containers',
            size: 140,
            header: 'Contenedores',
            enableSorting: false,
            accessorFn: (row) => row.containerCount,
            Cell: ({ row }): React.JSX.Element => (
              <VStack align='start' spacing={0}>
                <Text fontSize='sm'>
                  {row.original.containers.length} de{' '}
                  {row.original.containerCount} con número
                </Text>
                {row.original.containers.map((container) => (
                  <Text key={container.id} fontSize='xs' color='gray.600'>
                    {container.number}
                  </Text>
                ))}
              </VStack>
            ),
          },
          {
            accessorKey: 'estimatedFreight',
            size: 115,
            header: 'Flete Est.',
            Cell: ({ row }): React.JSX.Element => (
              <VStack align='start' spacing={0}>
                <Text fontSize='sm' fontWeight='semibold'>
                  {money(row.original.estimatedFreight)}
                </Text>
                <Text fontSize='xs' color='gray.600'>
                  {money(row.original.costPerContainer)} c/u
                </Text>
              </VStack>
            ),
          },
        ],
      },
      {
        id: 'actions',
        header: '',
        columns: [
          {
            id: 'edit',
            size: 80,
            header: '',
            Cell: ({ row }): React.JSX.Element => (
              <Button
                as={Link_Next}
                href={`/dashboard/export/bookings/${row.original.id}`}
                size='sm'
                variant='outline'
                colorScheme='green'
              >
                Editar
              </Button>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnOrdering: false,
    enableColumnFilters: false,
    enableCellActions: false,
    enableDensityToggle: false,
    enableColumnDragging: false,
    enableHiding: false,
    enableColumnPinning: true,
    layoutMode: 'grid',
    enableColumnActions: false,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      columnPinning: { right: ['edit'] },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '575px' } },
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableBookings;
