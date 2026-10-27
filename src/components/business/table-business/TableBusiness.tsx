import { Button } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Link_Next from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailBusiness from './DetailBusiness';
import { useBusinesses } from '../../../hooks/business/getAllBusiness';
import { BusinessResponse } from '../../../types/merchant/merchant.response';

const TableBusiness = (): React.JSX.Element => {
  const { data = [], error } = useBusinesses();
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const dataRes = error.response?.data;
      if (dataRes?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<BusinessResponse>[]>(
    () => [
      {
        header: 'Información básica',
        columns: [
          {
            accessorKey: 'name',
            header: 'Nombre',
          },
          {
            id: 'city.name',
            accessorFn: (row) => row.city?.name ?? '',
            header: 'Ciudad',
          },
          {
            accessorKey: 'address',
            header: 'Dirección',
          },
        ],
      },
      {
        header: 'Detalles de la finca',
        columns: [
          {
            accessorKey: 'area',
            header: 'Área (ha)',
            Cell: ({ cell }): React.JSX.Element => {
              const value = cell.getValue<number | null>();
              return <span>{value != null ? `${value} ha` : 'N/A'}</span>;
            },
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
        header: 'Códigos regulatorios',
        columns: [
          {
            accessorKey: 'codeMAGAP',
            header: 'Código MAGAP',
          },
          {
            accessorKey: 'codeAGROCALIDAD',
            header: 'Código Agrocalidad',
          },
        ],
      },
      {
        header: 'Tipo',
        columns: [
          {
            accessorKey: 'fruitType',
            header: 'Tipo de fruta',
          },
        ],
      },
      {
        id: 'actions',
        header: '',
        columns: [
          {
            id: 'edit',
            size: 90,
            header: '',
            Cell: ({ row }): React.JSX.Element => (
              <Button size='sm' variant='outline' colorPalette='green' asChild>
                <Link_Next
                  href={`/dashboard/producer/fincas/${row.original.id}`}
                >
                  Editar
                </Link_Next>
              </Button>
            ),
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
        right: ['edit'],
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
        <DetailBusiness business={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableBusiness;
