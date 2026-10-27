/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailExportsSent from './DetailExportsSent';
import { useExportsSent } from '../../../hooks/liquidation/getExportsSent';
import { usePagination } from '../../../hooks/usePagination';

const TableExportsSent = (): React.JSX.Element => {
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
            header: 'ID de exportación',
          },
        ],
      },
      {
        header: 'Información básica',
        columns: [
          {
            accessorKey: 'export.id',
            header: 'ID de exportación',
          },
          {
            accessorKey: 'export.boxQuantity',
            header: 'Cantidad de cajas',
          },
          {
            accessorKey: 'export.boxBrand.name',
            header: 'Marca de cajas',
          },
          {
            accessorKey: 'export.boxBrand.brandCode',
            header: 'Código de marca',
          },
        ],
      },
      {
        header: 'Información de producto',
        columns: [
          {
            accessorKey: 'export.boxBrand.netWeightBox',
            header: 'Peso neto por caja',
          },
          {
            accessorKey: 'export.boxBrand.grossWeightBox',
            header: 'Peso bruto por caja',
          },
        ],
      },
      {
        header: 'Información de logística',
        columns: [
          {
            accessorKey: 'export.harborDeparture.name',
            header: 'Puerto de salida',
          },
          {
            accessorKey: 'export.harborDestination.name',
            header: 'Puerto de destino',
          },
          {
            accessorKey: 'export.pendingExportSent',
            header: 'Pendiente de envío',
            Cell: ({ cell }) => (cell.getValue() ? 'Sí' : 'No'),
          },
        ],
      },
      {
        header: 'Información comercial',
        columns: [
          {
            accessorKey: 'export.merchant.businessName',
            header: 'Nombre del comerciante',
          },
          {
            accessorKey: 'export.business.name',
            header: 'Nombre de la empresa',
          },
          {
            accessorKey: 'export.client.businessName',
            header: 'Nombre del cliente',
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
        <DetailExportsSent exportSent={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableExportsSent;
