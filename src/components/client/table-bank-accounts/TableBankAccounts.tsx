 
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import { BankAccountResponse } from '@/types/bankAccount.response';
import DetailBankAccounts from './DetailBankAccounts';
import { useBankAccounts } from '../../../hooks/bank-account/getBankAccounts';

const TableBankAccounts = (): React.JSX.Element => {
  const { data = [] } = useBankAccounts();


  const columns = useMemo<MRT_ColumnDef<BankAccountResponse>[]>(() => [
    {
      header: 'Entidad asociada',
      columns: [
        {
          accessorFn: (row) =>
            row.client ? 'Cliente' : row.merchant ? 'Productor' : 'N/A',
          header: 'Tipo de entidad',
        },
        {
          accessorFn: (row) =>
            row.merchant?.businessName || row.client?.businessName || 'N/A',
          header: 'Nombre comercial',
        },
        {
          accessorFn: (row) =>
            row.merchant?.businessId || row.client?.businessId || 'N/A',
          header: 'RUC',
        },
        {
          accessorFn: (row) => row.merchant?.city?.name || 'N/A',
          header: 'Ciudad',
        },
        {
          accessorFn: (row) => row.merchant?.address || 'N/A',
          header: 'Dirección',
        },
      ],
    },
    {
      header: 'Información bancaria',
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
          header: 'Número de cuenta',
        },
      ],
    },
    {
      header: 'Contacto',
      columns: [
        {
          accessorFn: (row) =>
            row.client?.email || row.merchant?.email || 'N/A',
          header: 'Correo electrónico',
        },
        {
          accessorFn: (row) => row.client?.phone || 'N/A',
          header: 'Teléfono',
        },
      ],
    },
    {
      header: 'Tipo',
      columns: [
        {
          accessorKey: 'type',
          header: 'Tipo de cuenta',
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
