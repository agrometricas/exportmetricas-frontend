import {
  Badge,
  Box,
  Button,
  HStack,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
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
import { useDocumentBoard } from '../../hooks/booking/documentStatus';
import { BookingDocumentStatus } from '../../types/shipmentStatus';
import { formatDayMonthYearTime } from '../../utils/dayMonthYear';
import { missingSummary, SEMAPHORE_COLOR } from '../../utils/shipmentStatus';

const TableDocumentBoard = (): React.JSX.Element => {
  const { data = [], error } = useDocumentBoard();
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<BookingDocumentStatus>[]>(
    () => [
      {
        accessorKey: 'semaphore',
        header: 'Estado',
        size: 110,
        Cell: ({ row }): React.JSX.Element => (
          <Badge colorPalette={SEMAPHORE_COLOR[row.original.semaphore]}>
            {row.original.statusLabel}
          </Badge>
        ),
      },
      {
        accessorKey: 'bookingNumber',
        header: 'Booking',
        size: 170,
        Cell: ({ row }): React.JSX.Element => (
          <VStack align='start' gap={0}>
            <Text fontSize='sm' fontWeight='semibold'>
              {row.original.bookingNumber}
            </Text>
            <Text fontSize='xs' color='fg.muted'>
              {row.original.shippingCompany} · {row.original.shipName} →{' '}
              {row.original.destination}
            </Text>
          </VStack>
        ),
      },
      {
        accessorKey: 'etd',
        header: 'Zarpe',
        size: 130,
        Cell: ({ cell }): React.JSX.Element => (
          <span>{formatDayMonthYearTime(cell.getValue<string>())}</span>
        ),
      },
      {
        accessorKey: 'progress',
        header: 'Avance',
        size: 130,
        Cell: ({ row }): React.JSX.Element => (
          <HStack gap={2} w='100%'>
            <Box flex='1'>
              <Progress.Root
                value={row.original.progress}
                colorPalette={SEMAPHORE_COLOR[row.original.semaphore]}
                size='sm'
                borderRadius='md'
              >
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Box>
            <Text fontSize='xs'>{row.original.progress} %</Text>
          </HStack>
        ),
      },
      {
        id: 'missing',
        header: 'Qué falta',
        size: 320,
        enableSorting: false,
        Cell: ({ row }): React.JSX.Element =>
          row.original.missing.length === 0 ? (
            <Text fontSize='sm' color='fg.muted'>
              Nada
            </Text>
          ) : (
            <VStack align='start' gap={0}>
              {missingSummary(row.original.missing).map((line) => (
                <Text key={line} fontSize='xs'>
                  {line}
                </Text>
              ))}
            </VStack>
          ),
      },
      {
        id: 'open',
        header: '',
        size: 90,
        enableSorting: false,
        Cell: ({ row }): React.JSX.Element => (
          <Button size='sm' variant='outline' colorPalette='green' asChild>
            <Link_Next
              href={`/dashboard/export/bookings/${row.original.bookingId}`}
            >
              Documentos
            </Link_Next>
          </Button>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: data as BookingDocumentStatus[],
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
      columnPinning: { right: ['open'] },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '575px' } },
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableDocumentBoard;
