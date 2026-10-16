/* eslint-disable @typescript-eslint/no-explicit-any */
import { Center } from '@chakra-ui/react';
import { Box } from '@mui/material';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { BsFillSendCheckFill, BsFillSendDashFill } from 'react-icons/bs';
import DetailExport from './DetailExport';
import { useExports } from '../../../hooks/export/getExports';
import { usePagination } from '../../../hooks/usePagination';
import { ExportResponse } from '../../../types/export.response';

const TableExport = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useExports(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (!!error) {
      const { response } = error as any;
      const { data: dataRes } = response;
      const { statusCode } = dataRes;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const columns = useMemo<MRT_ColumnDef<ExportResponse>[]>(
    () => [
      {
        header: 'Exportación',
        columns: [
          { accessorKey: 'boxQuantity', header: 'Cajas' },
          { accessorKey: 'boxBrand.name', header: 'Caja' },
          { accessorKey: 'boxBrand.brand.name', header: 'Marca' },
          { accessorKey: 'boxBrand.brandCode', header: 'Código Marca' },
          { accessorKey: 'shipName', header: 'Barco' },
          { accessorKey: 'bookingNumber', header: 'Booking' },
          { accessorKey: 'shippingDateTime', header: 'Fecha Máxima de Ingreso' },
        ],
      },
      {
        header: 'Productor/Finca',
        columns: [
          { accessorKey: 'merchant.businessName', header: 'Productor' },
          { accessorKey: 'merchant.businessId', header: 'RUC' },
          { accessorKey: 'business.name', header: 'Finca' },
          { accessorKey: 'business.city.name', header: 'Ciudad Finca' },
        ],
      },
      {
        header: 'Cliente',
        columns: [
          { accessorKey: 'client.businessName', header: 'Razón Social' },
          { accessorKey: 'client.businessId', header: 'RUC' },
          {
            accessorKey: 'client.email',
            header: 'Email',
            enableClickToCopy: true,
          },
          {
            accessorKey: 'client.phone',
            header: 'Teléfono',
            enableClickToCopy: true,
          },
        ],
      },
      {
        header: 'Puertos',
        columns: [
          { accessorKey: 'harborDeparture.name', header: 'Salida' },
          { accessorKey: 'harborDestination.name', header: 'Destino' },
        ],
      },
      {
        header: 'Envío',
        columns: [
          {
            id: 'enviado',
            header: 'Enviado',
            accessorFn: (row) => `${row.pendingExportSent}`,
            Cell: ({ renderedCellValue }) => (
              <Center>
                {renderedCellValue === 'false' ? (
                  <BsFillSendCheckFill color='green' />
                ) : (
                  <BsFillSendDashFill color='orange' />
                )}
              </Center>
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
    enableColumnPinning: true,
    enableColumnDragging: false,
    enableHiding: false,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      columnPinning: {
        left: ['mrt-row-expand', 'boxQuantity'],
        right: ['pendingExportSent'],
      },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '100%' } },
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
          left: '0px',
          maxWidth:
            Number(windowSize.width) >= 768 ? `${width.md}px` : `${width.sm}px`,
          position: 'sticky',
          width: '100%',
        }}
      >
        <DetailExport data={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableExport;
