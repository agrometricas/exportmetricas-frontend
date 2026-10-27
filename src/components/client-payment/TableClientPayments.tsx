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
import DetailClientPayments from './DetailClientPayments';
import { useClientPayments } from '../../hooks/client-payment/getClientPayments';
import { usePagination } from '../../hooks/usePagination';
import { ClientPayment } from '../../types/client-payment/client-payment.response';

const TableClientPayments = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useClientPayments(paginationParams);
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

  const columns = useMemo<MRT_ColumnDef<ClientPayment>[]>(
    () => [
      {
        header: 'Información General',
        columns: [
          {
            accessorKey: 'client.businessName',
            header: 'Nombre del Cliente',
          },
          {
            accessorKey: 'client.businessId',
            header: 'RUC del Cliente',
          },
          {
            accessorKey: 'client.type',
            header: 'Tipo de Cliente',
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
            accessorKey: 'total',
            header: 'Total a Pagar',
          },
          {
            accessorKey: 'description',
            header: 'Descripción',
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
              const url = cell.getValue<string | undefined>();
              return url ? (
                <a href={url} target='_blank' rel='noopener noreferrer'>
                  Ver Transferencia{' '}
                  <Icon color='green.fg' ml={2} asChild><BsImage /></Icon>
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
