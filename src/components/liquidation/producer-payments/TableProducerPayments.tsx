/* eslint-disable @typescript-eslint/no-explicit-any */
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
import DetailProducerPayments from './DetailProducerPayments';
import { useProducerPayments } from '../../../hooks/liquidation/getProducerPayments';

const TableProducerPayments = (): React.JSX.Element => {
  const { rows: data, tableOptions } = useProducerPayments();

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: 'Información general',
        columns: [
          {
            accessorKey: 'merchant.businessName',
            header: 'Nombre del productor',
          },
          {
            accessorKey: 'merchant.businessId',
            header: 'RUC del productor',
          },
          {
            accessorKey: 'merchant.contractType',
            header: 'Tipo de contrato',
          },
        ],
      },
      {
        header: 'Puertos',
        columns: [
          {
            accessorKey: 'harborDeparture.name',
            header: 'Puerto de salida',
          },
          {
            accessorKey: 'harborDestination.name',
            header: 'Puerto de destino',
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
            accessorKey: 'subtotal1',
            header: 'Subtotal inicial',
          },
          {
            accessorKey: 'transport',
            header: 'Costo de transporte',
          },
          {
            accessorKey: 'materials',
            header: 'Materiales',
          },
          {
            accessorKey: 'others',
            header: 'Otros costos',
          },
          {
            accessorKey: 'total',
            header: 'Total a pagar',
          },
          {
            accessorKey: 'amount',
            header: 'Monto transferido',
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
              const url = cell.getValue() as string | undefined;
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
        <DetailProducerPayments producerPayment={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableProducerPayments;
