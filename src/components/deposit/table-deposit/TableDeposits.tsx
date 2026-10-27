import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailDeposits from './DetailDeposits';
import { useDeposits } from '../../../hooks/deposit/getDeposits';
import { DepositResponse } from '../../../types/deposit/deposit.response';

const TableDeposits = (): React.JSX.Element => {
  const { data = [] } = useDeposits();


  const columns = useMemo<MRT_ColumnDef<DepositResponse>[]>(() => [
    {
      header: 'Depósito',
      columns: [
        {
          accessorKey: 'name',
          header: 'Nombre del depósito',
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
          header: 'Hora de apertura',
        },
        {
          accessorKey: 'closeTime',
          header: 'Hora de cierre',
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
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) => (
      <TableDetailPanel>
        <DetailDeposits deposit={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableDeposits;
