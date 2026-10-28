'use client';

import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import { listTableOptions } from '@/utils/listTableOptions';
import DetailExportSentConfirmedCost from './DetailExportSentConfirmedCost';
import { useConfirmedExportSents } from '../../hooks/export/export-sent/getConfirmedExportSents';
import { ExportSentConfirmedCost } from '../../types/export-sent/exportSentConfirmedCost';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

export default function TableExportSentConfirmedCost(): React.JSX.Element {
  const { data = [], ...query } = useConfirmedExportSents();

  const columns = useMemo<MRT_ColumnDef<ExportSentConfirmedCost>[]>(
    () => [
      {
        header: 'Información general',
        columns: [
          {
            accessorKey: 'export.id',
            header: 'ID exportación',
          },
          {
            accessorKey: 'export.contractType',
            header: 'Tipo de contrato',
          },
          {
            accessorKey: 'export.cuttingDate',
            header: 'Fecha corte',
            Cell: ({ cell }) => formatDayMonthYear(cell.getValue<string>()),
          },
          {
            accessorKey: 'export.boxQuantity',
            header: 'Cajas exportadas',
          },
          {
            accessorKey: 'export.weekDescription',
            header: 'Semana',
          },
        ],
      },
      {
        header: 'Productor y cliente',
        columns: [
          {
            accessorKey: 'export.merchant.businessName',
            header: 'Productor',
          },
          {
            accessorKey: 'export.business.name',
            header: 'Finca',
          },
          {
            accessorKey: 'export.client.businessName',
            header: 'Cliente',
          },
          {
            accessorKey: 'export.client.countryId',
            header: 'País cliente',
          },
        ],
      },
      {
        header: 'Estado de costos',
        columns: [
          {
            accessorKey: 'pendingProducerPayment',
            header: 'Pendiente pago productor',
            Cell: ({ cell }) => (cell.getValue<boolean>() ? 'Sí' : 'No'),
          },
          {
            accessorKey: 'pendingClientPayment',
            header: 'Pendiente cobro cliente',
            Cell: ({ cell }) => (cell.getValue<boolean>() ? 'Sí' : 'No'),
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
    enableColumnPinning: true,
    enableColumnDragging: false,
    enableHiding: false,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      columnPinning: {
        left: ['mrt-row-expand'],
        right: ['export.id'],
      },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '80%' } },
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) => (
      <TableDetailPanel>
        <DetailExportSentConfirmedCost item={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
}
