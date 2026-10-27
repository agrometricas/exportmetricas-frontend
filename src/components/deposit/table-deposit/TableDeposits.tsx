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
import DetailDeposits from './DetailDeposits';
import { useDeposits } from '../../../hooks/deposit/getDeposits';
import { usePagination } from '../../../hooks/usePagination';
import { DepositResponse } from '../../../types/deposit/deposit.response';

const TableDeposits = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useDeposits(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const dataRes = error.response?.data;
      if (dataRes?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<DepositResponse>[]>(() => [
    {
      header: 'Depósito',
      columns: [
        {
          accessorKey: 'name',
          header: 'Nombre del Depósito',
        },
        {
          accessorKey: 'code',
          header: 'Código',
        },
      ],
    },
    {
      header: 'Ubicación',
      columns: [
        {
          accessorFn: (row) => row.city?.name || 'N/A',
          header: 'Ciudad',
        },
        {
          accessorKey: 'address',
          header: 'Dirección',
        },
        {
          accessorKey: 'latitude',
          header: 'Latitud',
          Cell: ({ cell }): React.ReactNode => {
            const value = cell.getValue<number | null>();
            return <span>{value !== null && value !== undefined ? value.toFixed(6) : 'No definida'}</span>;
          },
        },
        {
          accessorKey: 'longitude',
          header: 'Longitud',
          Cell: ({ cell }): React.ReactNode => {
            const value = cell.getValue<number | null>();
            return <span>{value !== null && value !== undefined ? value.toFixed(6) : 'No definida'}</span>;
          },
        },
      ],
    },
    {
      header: 'Horario',
      columns: [
        {
          accessorKey: 'openTime',
          header: 'Hora de Apertura',
        },
        {
          accessorKey: 'closeTime',
          header: 'Hora de Cierre',
        },
      ],
    },
    {
      header: 'Contactos',
      columns: [
        {
          accessorKey: 'contacts',
          header: 'Nombres',
          Cell: ({ cell }): React.ReactNode => {
            const contacts = cell.getValue<DepositResponse['contacts']>();
            return (
              <span>
                {contacts.length > 0
                  ? contacts.map((c) => c.name).join(', ')
                  : 'Sin contactos'}
              </span>
            );
          },
        },
        {
          accessorKey: 'contactsPhone',
          header: 'Teléfonos',
          Cell: ({ row }): React.ReactNode => {
            const contacts = row.original.contacts;
            return (
              <span>
                {contacts.length > 0
                  ? contacts.map((c) => c.phone).join(', ')
                  : 'Sin teléfonos'}
              </span>
            );
          },
        },
      ],
    },
  ], []);

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
        right: ['code'],
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
          width: '100%'
        }}
      >
        <DetailDeposits deposit={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableDeposits;
