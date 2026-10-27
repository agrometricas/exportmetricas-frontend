/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import DetailExportsSent from './DetailExportsSent';
import { useExportsSent } from '../../../hooks/liquidation/getExportsSent';
import { usePagination } from '../../../hooks/usePagination';

const TableExportsSent = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useExportsSent(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const { response } = error as any;
      const { data: dataRes } = response;
      const { statusCode } = dataRes;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: 'Identificador',
        columns: [
          {
            accessorKey: 'export.id',
            header: 'ID de Exportación',
          },
        ],
      },
      {
        header: 'Información Básica',
        columns: [
          {
            accessorKey: 'export.id',
            header: 'ID de Exportación',
          },
          {
            accessorKey: 'export.boxQuantity',
            header: 'Cantidad de Cajas',
          },
          {
            accessorKey: 'export.boxBrand.name',
            header: 'Marca de Cajas',
          },
          {
            accessorKey: 'export.boxBrand.brandCode',
            header: 'Código de Marca',
          },
        ],
      },
      {
        header: 'Información de Producto',
        columns: [
          {
            accessorKey: 'export.boxBrand.netWeightBox',
            header: 'Peso Neto por Caja',
          },
          {
            accessorKey: 'export.boxBrand.grossWeightBox',
            header: 'Peso Bruto por Caja',
          },
        ],
      },
      {
        header: 'Información de Logística',
        columns: [
          {
            accessorKey: 'export.harborDeparture.name',
            header: 'Puerto de Salida',
          },
          {
            accessorKey: 'export.harborDestination.name',
            header: 'Puerto de Destino',
          },
          {
            accessorKey: 'export.pendingExportSent',
            header: 'Pendiente de Envío',
            Cell: ({ cell }) => (cell.getValue() ? 'Sí' : 'No'),
          },
        ],
      },
      {
        header: 'Información Comercial',
        columns: [
          {
            accessorKey: 'export.merchant.businessName',
            header: 'Nombre del Comerciante',
          },
          {
            accessorKey: 'export.business.name',
            header: 'Nombre de la Empresa',
          },
          {
            accessorKey: 'export.client.businessName',
            header: 'Nombre del Cliente',
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
        css={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          left: '0px',

          maxWidth:
            windowSize.width && windowSize.width >= 768
              ? `${width.md}px`
              : `${width.sm}px`,

          position: 'sticky',
          width: '100%',
        }}
      >
        <DetailExportsSent exportSent={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableExportsSent;
