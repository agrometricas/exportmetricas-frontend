'use client';

import { Box } from '@chakra-ui/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useMemo } from 'react';
import DetailExportSentConfirmedCost from './DetailExportSentConfirmedCost';
import { useConfirmedExportSents } from '../../hooks/export/export-sent/getConfirmedExportSents';
import { ExportSentConfirmedCost } from '../../types/export-sent/exportSentConfirmedCost';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

export default function TableExportSentConfirmedCost({
  windowSize,
  width,
}: {
  windowSize: { width: number | null; height: number | null };
  width: { sm: number; md: number };
}): JSX.Element {
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
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        padding: '0px',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          maxWidth:
            windowSize.width && windowSize.width >= 768
              ? `${width.md}px`
              : `${width.sm}px`,
          position: 'sticky',
          width: '100%',
        }}
      >
        <DetailExportSentConfirmedCost item={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
}
