import { Icon } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';
import { BsImage } from 'react-icons/bs';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailClientPayments from './DetailClientPayments';
import { useClientPayments } from '../../hooks/client-payment/getClientPayments';
import { ClientPayment } from '../../types/client-payment/client-payment.response';

const TableClientPayments = (): React.JSX.Element => {
  const { rows: data, tableOptions } = useClientPayments();

  const columns = useMemo<MRT_ColumnDef<ClientPayment>[]>(
    () => [
      {
        header: 'Información general',
        columns: [
          {
            accessorKey: 'client.businessName',
            header: 'Nombre del cliente',
          },
          {
            accessorKey: 'client.businessId',
            header: 'RUC del cliente',
          },
          {
            accessorKey: 'client.type',
            header: 'Tipo de cliente',
          },
        ],
      },
      {
        header: 'Detalles financieros',
        columns: [
          {
            accessorKey: 'boxQuantity',
            header: 'Cantidad de cajas',
          },
          {
            accessorKey: 'price',
            header: 'Precio unitario',
          },
          {
            accessorKey: 'total',
            header: 'Total a pagar',
          },
          {
            accessorKey: 'description',
            header: 'Descripción',
          },
        ],
      },
      {
        header: 'Cuentas bancarias',
        columns: [
          {
            accessorKey: 'sourceBankAccount.accountNumber',
            header: 'Cuenta origen',
          },
          {
            accessorKey: 'destinationBankAccount.accountNumber',
            header: 'Cuenta destino',
          },
        ],
      },
      {
        header: 'Transferencia',
        columns: [
          {
            accessorKey: 'transferUrl',
            header: 'Acceso',
            Cell: ({ cell }): React.JSX.Element => {
              const url = cell.getValue<string | undefined>();
              return url ? (
                <a href={url} target='_blank' rel='noopener noreferrer'>
                  Ver Transferencia{' '}
                  <Icon color='green.fg' ml={2} asChild>
                    <BsImage />
                  </Icon>
                </a>
              ) : (
                <span>No disponible</span>
              );
            },
          },
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    ...tableOptions,
    enableColumnOrdering: false,
    enableColumnFilters: false,
    enableCellActions: false,
    enableDensityToggle: false,
    enableColumnPinning: true,
    enableColumnDragging: false,
    enableHiding: false,
    initialState: {
      columnPinning: {
        left: ['mrt-row-expand'],
        right: ['transferUrl'],
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
        <DetailClientPayments clientPayment={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableClientPayments;
