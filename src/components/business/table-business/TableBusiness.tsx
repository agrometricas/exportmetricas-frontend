import { Box } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import DetailBusiness from './DetailBusiness';
import { useBusinesses } from '../../../hooks/business/getAllBusiness';
import { usePagination } from '../../../hooks/usePagination';
import { BusinessResponse } from '../../../types/merchant/merchant.response';

const TableBusiness = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useBusinesses(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const dataRes = error.response?.data;
      if (dataRes?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<BusinessResponse>[]>(
    () => [
      {
        header: 'Información Básica',
        columns: [
          {
            accessorKey: 'name',
            header: 'Nombre',
          },
          {
            accessorKey: 'city.name',
            header: 'Ciudad',
          },
          {
            accessorKey: 'address',
            header: 'Dirección',
          },
        ],
      },
      {
        header: 'Detalles de la Finca',
        columns: [
          {
            accessorKey: 'area',
            header: 'Área (ha)',
            Cell: ({ cell }): React.JSX.Element => {
              const value = cell.getValue<number | null>();
              return <span>{value != null ? `${value} ha` : 'N/A'}</span>;
            },
          },
          {
            accessorKey: 'approvedBoxes',
            header: 'Cajas Aprobadas',
            Cell: ({ cell }): React.JSX.Element => {
              const value = cell.getValue<number | null>();
              return <span>{value != null ? value : 'N/A'}</span>;
            },
          },
          {
            accessorKey: 'latitude',
            header: 'Latitud',
          },
          {
            accessorKey: 'longitude',
            header: 'Longitud',
          },
        ],
      },
      {
        header: 'Códigos Regulatorios',
        columns: [
          {
            accessorKey: 'codeMAGAP',
            header: 'Código MAGAP',
          },
          {
            accessorKey: 'codeAGROCALIDAD',
            header: 'Código Agrocalidad',
          },
        ],
      },
      {
        header: 'Tipo',
        columns: [
          {
            accessorKey: 'fruitType',
            header: 'Tipo de Fruta',
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
        right: ['fruitType'],
      },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '575px' } },
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
        <DetailBusiness business={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableBusiness;
