/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Icon } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { BsImage } from 'react-icons/bs';
import DetailProducerPayments from './DetailProducerPayments';
import { useProducerPayments } from '../../../hooks/liquidation/getProducerPayments';
import { usePagination } from '../../../hooks/usePagination';

const TableProducerPayments = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useProducerPayments(paginationParams);
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
          width: '100%',
        }}
      >
        <DetailProducerPayments producerPayment={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableProducerPayments;
