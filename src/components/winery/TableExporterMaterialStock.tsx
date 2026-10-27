import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';
import ErrorState from '@/components/ui/states/ErrorState';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailExporterMaterialStock from './DetailExporterMaterialStock';
import { useExporterMaterialStock } from '../../hooks/winery/getExporterMaterialStock';
import { ExporterMaterialStock } from '../../types/winery/exporterMaterialStock.response';
import { MATERIAL_TYPE_LABELS } from '../../utils/materialTypeLabels';

export default function TableExporterMaterialStock(): React.JSX.Element {
  const { data: session } = useSession();
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useExporterMaterialStock({
    exporterId: Number(session?.user.exporterId),
  });

  const columns = useMemo<MRT_ColumnDef<ExporterMaterialStock>[]>(
    () => [
      {
        header: 'Material',
        columns: [
          {
            accessorKey: 'materialDetail.name',
            header: 'Nombre comercial',
          },
          {
            accessorKey: 'materialType',
            header: 'Tipo',
            Cell: ({ cell }) =>
              MATERIAL_TYPE_LABELS[cell.getValue<string>()] ?? cell.getValue(),
          },
          {
            accessorKey: 'materialDetail.code',
            header: 'Código',
          },
        ],
      },
      {
        header: 'Stock',
        columns: [
          {
            accessorKey: 'assignedStock',
            header: 'Stock asignado',
            Cell: ({ cell }) => `${cell.getValue<number>()} u.`,
          },
          {
            accessorKey: 'currentStock',
            header: 'Stock actual',
            Cell: ({ cell }) => `${cell.getValue<number>()} u.`,
          },
        ],
      },
      {
        header: 'Costo',
        columns: [
          {
            accessorKey: 'assignedCost',
            header: 'Costo asignado',
            Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
          },
          {
            accessorKey: 'currentCost',
            header: 'Costo actual',
            Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
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
        right: ['materialType'],
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
        <DetailExporterMaterialStock material={row.original} />
      </TableDetailPanel>
    ),
    state: { isLoading },
    localization: MRT_Localization_ES,
  });

  if (error) {
    return (
      <ErrorState
        error={error}
        title='No se pudo cargar el stock'
        onRetry={refetch}
      />
    );
  }

  return <MaterialReactTable table={table} />;
}
