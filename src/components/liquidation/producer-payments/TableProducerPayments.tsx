/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { BsImage } from 'react-icons/bs';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailProducerPayments from './DetailProducerPayments';
import { useProducerPayments } from '../../../hooks/liquidation/getProducerPayments';

const TableProducerPayments = (): React.JSX.Element => {
  const { rows: data, error, tableOptions } = useProducerPayments();
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
        header: 'Información General',
        columns: [
          {
            accessorKey: 'merchant.businessName',
            header: 'Nombre del Productor',
          },
          {
            accessorKey: 'merchant.businessId',
            header: 'RUC del Productor',
          },
          {
            accessorKey: 'merchant.contractType',
            header: 'Tipo de Contrato',
          },
        ],
      },
      {
        header: 'Puertos',
        columns: [
          {
            accessorKey: 'harborDeparture.name',
            header: 'Puerto de Salida',
          },
          {
            accessorKey: 'harborDestination.name',
            header: 'Puerto de Destino',
          },
        ],
      },
      {
        header: 'Detalles Financieros',
        columns: [
          {
            accessorKey: 'boxQuantity',
            header: 'Cantidad de Cajas',
          },
          {
            accessorKey: 'price',
            header: 'Precio Unitario',
          },
          {
            accessorKey: 'subtotal1',
            header: 'Subtotal Inicial',
          },
          {
            accessorKey: 'transport',
            header: 'Costo de Transporte',
          },
          {
            accessorKey: 'materials',
            header: 'Materiales',
          },
          {
            accessorKey: 'others',
            header: 'Otros Costos',
          },
          {
            accessorKey: 'total',
            header: 'Total a Pagar',
          },
          {
            accessorKey: 'amount',
            header: 'Monto Transferido',
          },
        ],
      },
      {
        header: 'Cuentas Bancarias',
        columns: [
          {
            accessorKey: 'sourceBankAccount.accountNumber',
            header: 'Cuenta Origen',
          },
          {
            accessorKey: 'destinationBankAccount.accountNumber',
            header: 'Cuenta Destino',
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
