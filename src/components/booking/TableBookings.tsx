import { Button, Text, VStack } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Link_Next from 'next/link';
import React, { useMemo } from 'react';
import { listTableOptions } from '@/utils/listTableOptions';
import { useBookings } from '../../hooks/booking/getBookings';
import { BookingResponse } from '../../types/booking';
import {
  formatDayMonthYear,
  formatDayMonthYearTime,
} from '../../utils/dayMonthYear';

const money = (value: string): string => `$${Number(value).toFixed(2)}`;

const TableBookings = (): React.JSX.Element => {
  const { data = [], ...query } = useBookings();

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
        header: 'Zarpe y llegada',
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
        header: 'Contenedores y flete',
        columns: [
          {
            id: 'containers',
            size: 140,
            header: 'Contenedores',
            enableSorting: false,
            accessorFn: (row) => row.containerCount,
            Cell: ({ row }): React.JSX.Element => (
              <VStack align='start' gap={0}>
                <Text fontSize='sm'>
                  {row.original.containers.length} de{' '}
                  {row.original.containerCount} con número
                </Text>
                {row.original.containers.map((container) => (
                  <Text key={container.id} fontSize='xs' color='fg.muted'>
                    {container.number}
                    {container.exportId ? ` · exp. ${container.exportId}` : ''}
                  </Text>
                ))}
              </VStack>
            ),
          },
          {
            accessorKey: 'estimatedFreight',
            size: 115,
            header: 'Flete est.',
            Cell: ({ row }): React.JSX.Element => (
              <VStack align='start' gap={0}>
                <Text fontSize='sm' fontWeight='semibold'>
                  {money(row.original.estimatedFreight)}
                </Text>
                <Text fontSize='xs' color='fg.muted'>
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
              <Button size='sm' variant='outline' colorPalette='green' asChild>
                <Link_Next
                  href={`/dashboard/export/bookings/${row.original.id}`}
                >
                  Editar
                </Link_Next>
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
    ...listTableOptions(query),
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
