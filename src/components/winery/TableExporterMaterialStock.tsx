import { Box } from '@chakra-ui/react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useMemo } from 'react';
import DetailExporterMaterialStock from './DetailExporterMaterialStock';
import { useExporterMaterialStock } from '../../hooks/winery/getExporterMaterialStock';
import { ExporterMaterialStock } from '../../types/winery/exporterMaterialStock.response';
import { MATERIAL_TYPE_LABELS } from '../../utils/materialTypeLabels';

export default function TableExporterMaterialStock({
  windowSize,
  width,
}: {
  windowSize: { width: number | null; height: number | null };
  width: { sm: number; md: number };
}): JSX.Element {
  const { data = [] } = useExporterMaterialStock({ exporterId: 1 });

  const columns = useMemo<MRT_ColumnDef<ExporterMaterialStock>[]>(
    () => [
      {
        header: 'Material',
        columns: [
          {
            accessorKey: 'materialDetail.name',
            header: 'Nombre Comercial',
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
            header: 'Stock Asignado',
            Cell: ({ cell }) => `${cell.getValue<number>()} u.`,
          },
          {
            accessorKey: 'currentStock',
            header: 'Stock Actual',
            Cell: ({ cell }) => `${cell.getValue<number>()} u.`,
          },
        ],
      },
      {
        header: 'Costo',
        columns: [
          {
            accessorKey: 'assignedCost',
            header: 'Costo Asignado',
            Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
          },
          {
            accessorKey: 'currentCost',
            header: 'Costo Actual',
            Cell: ({ cell }) => `$${cell.getValue<number>().toFixed(2)}`,
          },
          {
            accessorKey: 'materialDetail.name',
            header: 'Nombre Comercial',
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
        css={{
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
        <DetailExporterMaterialStock material={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
}
