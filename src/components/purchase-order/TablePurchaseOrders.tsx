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
import { usePurchaseOrders } from '../../hooks/purchase-order/getPurchaseOrders';
import { PurchaseOrderSummary } from '../../types/purchaseOrder';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import { getWeekInfo } from '../../utils/getWeekInfo';

const TablePurchaseOrders = (): React.JSX.Element => {
  const { data = [], error } = usePurchaseOrders();
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<PurchaseOrderSummary>[]>(
    () => [
      {
        header: 'Orden',
        columns: [
          {
            accessorKey: 'weekStart',
            size: 170,
            header: 'Semana',
            Cell: ({ row }): React.JSX.Element => (
              <VStack align='start' spacing={0}>
                <Text fontSize='sm' fontWeight='semibold'>
                  {
                    getWeekInfo({
                      date: new Date(row.original.weekStart),
                    }).week.split(' //')[0]
                  }
                </Text>
                <Text fontSize='xs' color='gray.600'>
                  desde el {formatDayMonthYear(row.original.weekStart)}
                </Text>
              </VStack>
            ),
          },
          {
            accessorKey: 'merchant.businessName',
            size: 170,
            header: 'Productor',
          },
        ],
      },
      {
        header: 'Cajas',
        columns: [
          {
            accessorKey: 'totals.contractBoxes',
            size: 100,
            header: 'Contrato',
          },
          { accessorKey: 'totals.spotBoxes', size: 90, header: 'Spot' },
          { accessorKey: 'totals.boxes', size: 90, header: 'Total' },
        ],
      },
      {
        header: 'Avance',
        columns: [
          {
            id: 'exported',
            size: 150,
            header: 'Exportaciones',
            accessorFn: (row) => row.exportedLines,
            Cell: ({ row }): React.JSX.Element => (
              <Text fontSize='sm'>
                {row.original.exportedLines} de {row.original.lineCount}{' '}
                {row.original.lineCount === 1 ? 'línea' : 'líneas'}
              </Text>
            ),
          },
          {
            accessorKey: 'notes',
            size: 160,
            header: 'Notas',
            Cell: ({ cell }): React.JSX.Element => (
              <Text fontSize='sm' noOfLines={2}>
                {cell.getValue<string | null>() ?? ''}
              </Text>
            ),
          },
        ],
      },
      {
        id: 'actions',
        header: '',
        columns: [
          {
            id: 'open',
            size: 80,
            header: '',
            Cell: ({ row }): React.JSX.Element => (
              <Button
                as={Link_Next}
                href={`/dashboard/export/purchase-orders/${row.original.id}`}
                size='sm'
                variant='outline'
                colorScheme='green'
              >
                Abrir
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
      columnPinning: { right: ['open'] },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '575px' } },
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TablePurchaseOrders;
