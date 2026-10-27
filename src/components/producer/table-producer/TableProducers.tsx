import { Icon } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
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
import DetailProducers from './DetailProducers';
import { useMerchants } from '../../../hooks/merchants/getMerchants';
import { MerchantResponse } from '../../../types/merchant/merchant.response';

const TableProducers = (): React.JSX.Element => {
  const { data = [], error } = useMerchants();
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const dataRes = error.response?.data;
      if (dataRes?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<MerchantResponse>[]>(() => [
    {
      accessorKey: 'businessName',
      header: 'Productor',
      columns: [
        { accessorKey: 'businessName', header: 'Nombre' },
        {
          id: 'city.name',
          accessorFn: (row) => row.city?.name ?? '',
          header: 'Ciudad',
        },
        { accessorKey: 'email', header: 'Correo electrónico' },
        { accessorKey: 'businessId', header: 'RUC' },
      ],
    },
    {
      accessorKey: 'details',
      header: 'Detalles de finca',
      columns: [
        { accessorKey: 'address', header: 'Dirección' },
        {
          accessorKey: 'businesses',
          header: 'Fincas',
          Cell: ({ cell }): React.JSX.Element => {
            const value = cell.getValue<MerchantResponse['businesses']>();
            return <span>{value?.length || 0} asociadas</span>;
          },
        },
        {
          accessorFn: (row) => row.businesses.map(b => b.name).join(', '),
          header: 'Nombres',
        },
        {
          accessorFn: (row) => row.businesses.map(b => b.fruitType).join(', '),
          header: 'Tipo de cultivo',
        },
        {
          accessorFn: (row) => row.businesses.map(b => `${b.area} ha`).join(', '),
          header: 'Área',
        },
      ],
    },
    {
      header: 'Logo',
      columns: [
        {
          accessorKey: 'logoUrl',
          header: 'Acceso',
          Cell: ({ cell }): React.JSX.Element => {
            const url = cell.getValue<string>();
            return url ? (
              <a href={url} target='_blank' rel='noopener noreferrer'>
                <button style={{ display: 'flex', alignItems: 'center' }}>
                  Ver logo
                  <Icon color='green.fg' ml={2} asChild><BsImage /></Icon>
                </button>
              </a>
            ) : <span>No disponible</span>;
          },
          size: 150,
        },
      ],
    },
    {
      header: 'Contrato',
      columns: [
        { accessorKey: 'contractType', header: 'Tipo de contrato' },
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
        right: ['contractType'],
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
        <DetailProducers business={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableProducers;
