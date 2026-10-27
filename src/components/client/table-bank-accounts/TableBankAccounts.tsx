/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
import DetailBankAccounts from './DetailBankAccounts';
import { useBankAccounts } from '../../../hooks/bank-account/getBankAccounts';
import { usePagination } from '../../../hooks/usePagination';

const TableBankAccounts = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useBankAccounts(paginationParams);
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

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => [
    {
      header: 'Entidad Asociada',
      columns: [
        {
          accessorFn: (row) =>
            row.client ? 'Cliente' : row.merchant ? 'Productor' : 'N/A',
          header: 'Tipo de Entidad',
        },
        {
          accessorFn: (row) =>
            row.merchant?.businessName || row.client?.businessName || 'N/A',
          header: 'Nombre Comercial',
        },
        {
          accessorFn: (row) =>
            row.merchant?.businessId || row.client?.businessId || 'N/A',
          header: 'RUC',
        },
        {
          accessorFn: (row) =>
            row.merchant?.city?.name || row.client?.city?.name || 'N/A',
          header: 'Ciudad',
        },
        {
          accessorFn: (row) =>
            row.merchant?.address || row.client?.address || 'N/A',
          header: 'Dirección',
        },
      ],
    },
    {
      header: 'Información Bancaria',
      columns: [
        {
          accessorKey: 'bank',
          header: 'Banco',
        },
        {
          accessorKey: 'owner',
          header: 'Propietario',
        },
        {
          accessorKey: 'accountNumber',
          header: 'Número de Cuenta',
        },
      ],
    },
    {
      header: 'Contacto',
      columns: [
        {
          accessorFn: (row) =>
            row.client?.email || row.merchant?.email || 'N/A',
          header: 'Correo Electrónico',
        },
        {
          accessorFn: (row) =>
            row.client?.phone || row.merchant?.phone || 'N/A',
          header: 'Teléfono',
        },
      ],
    },
    {
      header: 'Tipo',
      columns: [
        {
          accessorKey: 'type',
          header: 'Tipo de Cuenta',
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
        <DetailBankAccounts account={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableBankAccounts;
