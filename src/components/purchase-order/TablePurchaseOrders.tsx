import { Badge, Button, Text, VStack } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Link_Next from 'next/link';
import React, { useMemo } from 'react';
import { listTableOptions } from '@/utils/listTableOptions';
import { usePurchaseOrders } from '../../hooks/purchase-order/getPurchaseOrders';
import { PurchaseOrderSummary } from '../../types/purchaseOrder';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import { getWeekInfo } from '../../utils/getWeekInfo';

const weekLabel = (iso: string): string =>
  getWeekInfo({ date: new Date(iso) }).week.split(' //')[0];

const TablePurchaseOrders = (): React.JSX.Element => {
  const { data = [], ...query } = usePurchaseOrders();

  const columns = useMemo<MRT_ColumnDef<PurchaseOrderSummary>[]>(
    () => [
      {
        header: 'Orden',
        columns: [
          {
            accessorKey: 'client.businessName',
            size: 180,
            header: 'Cliente',
          },
          {
            accessorKey: 'type',
            size: 100,
            header: 'Tipo',
            Cell: ({ cell }): React.JSX.Element =>
              cell.getValue<string>() === 'CONTRACT' ? (
                <Badge colorPalette='green'>Contrato</Badge>
              ) : (
                <Badge colorPalette='orange'>Spot</Badge>
              ),
          },
          {
            accessorKey: 'startWeek',
            size: 190,
            header: 'Semanas',
            Cell: ({ row }): React.JSX.Element => (
              <VStack align='start' gap={0}>
                <Text fontSize='sm' fontWeight='semibold'>
                  {weekLabel(row.original.startWeek)}
                </Text>
                <Text fontSize='xs' color='fg.muted'>
                  {row.original.type === 'SPOT'
                    ? `desde el ${formatDayMonthYear(row.original.startWeek)}`
                    : row.original.endWeek
                      ? `hasta la ${weekLabel(row.original.endWeek)}`
                      : 'sin fecha de fin'}
                </Text>
              </VStack>
            ),
          },
        ],
      },
      {
        header: 'Pedido',
        columns: [
          {
            accessorKey: 'weeklyBoxes',
            size: 120,
            header: 'Cajas/semana',
          },
          { accessorKey: 'lineCount', size: 100, header: 'Alícuotas' },
          {
            accessorKey: 'inForce',
            size: 110,
            header: 'Estado',
            Cell: ({ cell }): React.JSX.Element =>
              cell.getValue<boolean>() ? (
                <Badge colorPalette='green' variant='subtle'>
                  Vigente
                </Badge>
              ) : (
                <Badge colorPalette='gray' variant='subtle'>
                  No vigente
                </Badge>
              ),
          },
          {
            accessorKey: 'notes',
            size: 160,
            header: 'Notas',
            Cell: ({ cell }): React.JSX.Element => (
              <Text fontSize='sm' lineClamp={2}>
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
              <Button size='sm' variant='outline' colorPalette='green' asChild>
                <Link_Next
                  href={`/dashboard/export/purchase-orders/${row.original.id}`}
                >
                  Abrir
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
      columnPinning: { right: ['open'] },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '575px' } },
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TablePurchaseOrders;
