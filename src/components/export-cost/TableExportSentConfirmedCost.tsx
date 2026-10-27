'use client';

import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailExportSentConfirmedCost from './DetailExportSentConfirmedCost';
import { useConfirmedExportSents } from '../../hooks/export/export-sent/getConfirmedExportSents';
import { ExportSentConfirmedCost } from '../../types/export-sent/exportSentConfirmedCost';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

export default function TableExportSentConfirmedCost(): JSX.Element {
  const { data = [] } = useConfirmedExportSents();

  const columns = useMemo<MRT_ColumnDef<ExportSentConfirmedCost>[]>(
    () => [
      {
        header: 'Información General',
        columns: [
          {
            accessorKey: 'export.id',
            header: 'ID Exportación',
          },
          {
            accessorKey: 'export.contractType',
            header: 'Tipo de Contrato',
          },
          {
            accessorKey: 'export.cuttingDate',
            header: 'Fecha Corte',
            Cell: ({ cell }) =>
              formatDayMonthYear(cell.getValue<string>()),
          },
          {
            accessorKey: 'export.boxQuantity',
            header: 'Cajas Exportadas',
          },
          {
            accessorKey: 'export.weekDescription',
            header: 'Semana',
          },
        ],
      },
      {
        header: 'Productor y Cliente',
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
            header: 'País Cliente',
          },
        ],
      },
      {
        header: 'Estado de Costos',
        columns: [
          {
            accessorKey: 'pendingProducerPayment',
            header: 'Pendiente Pago Productor',
            Cell: ({ cell }) => (cell.getValue<boolean>() ? 'Sí' : 'No'),
          },
          {
            accessorKey: 'pendingClientPayment',
            header: 'Pendiente Cobro Cliente',
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
