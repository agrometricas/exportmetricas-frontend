import { isAxiosError } from 'axios';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailHarbors from './DetailHarbors';
import { useHarbors } from '../../../hooks/export/harbor/getHarbors';
import { usePagination } from '../../../hooks/usePagination';
import { ClientType } from '../../../types/client';
import { HarborResponse } from '../../../types/harbor.response';

const TableHarbors = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useHarbors(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const dataRes = error.response?.data;
      if (dataRes?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<HarborResponse>[]>(
    () => [
      {
        header: 'Puerto',
        columns: [
          {
            accessorKey: 'name',
            header: 'Nombre del puerto',
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
            accessorFn: (row) => row.country?.name ?? '—',
            header: 'País',
          },
          {
            accessorFn: (row) => row.city?.name ?? '—',
            header: 'Ciudad',
          },
          {
            accessorKey: 'address',
            header: 'Dirección',
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
        header: 'Clientes relacionados',
        columns: [
          {
            accessorKey: 'clients',
            header: 'Clientes',
            Cell: ({ cell }): React.JSX.Element => {
              const clients = cell.getValue<ClientType[]>();
              return (
                <span>
                  {clients?.map((client) => client.businessName).join(', ') || 'N/A'}
                </span>
              );
            },
          },
        ],
      },
      {
        header: 'Tipo',
        columns: [
          {
            accessorKey: 'type',
            header: 'Tipo',
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
        right: ['type'],
      },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '575px' } },
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) => (
      <TableDetailPanel>
        <DetailHarbors business={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableHarbors;
