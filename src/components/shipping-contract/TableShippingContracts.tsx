import { Badge, Button, Text, VStack } from '@chakra-ui/react';
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
import { useShippingContracts } from '../../hooks/shipping-contract/getShippingContracts';
import {
  ShippingContractResponse,
  ShippingContractRoute,
} from '../../types/shippingContract';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

const TableShippingContracts = (): React.JSX.Element => {
  const { data = [], error } = useShippingContracts();
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<ShippingContractResponse>[]>(
    () => [
      {
        header: 'Contrato',
        columns: [
          {
            accessorKey: 'shippingCompany.name',
            size: 130,
            header: 'Naviera',
          },
          {
            accessorKey: 'reference',
            size: 125,
            header: 'Referencia',
            Cell: ({ cell }): React.JSX.Element => (
              <span>{cell.getValue<string | null>() ?? '—'}</span>
            ),
          },
          {
            accessorKey: 'routes',
            size: 295,
            header: 'Rutas y costo por contenedor',
            enableSorting: false,
            Cell: ({ cell }): React.JSX.Element => (
              <VStack align='start' spacing={0}>
                {cell.getValue<ShippingContractRoute[]>().map((route) => (
                  <Text key={route.id} fontSize='sm'>
                    {route.harborDeparture.name} →{' '}
                    {route.harborDestination.name}:{' '}
                    <strong>
                      ${Number(route.costPerContainer).toFixed(2)}
                    </strong>
                    {route.transitDays ? ` · ${route.transitDays} días` : ''}
                  </Text>
                ))}
              </VStack>
            ),
          },
        ],
      },
      {
        header: 'Vigencia',
        columns: [
          {
            accessorKey: 'startDate',
            size: 100,
            header: 'Inicio',
            Cell: ({ cell }): React.JSX.Element => (
              <span>{formatDayMonthYear(cell.getValue<string>())}</span>
            ),
          },
          {
            accessorKey: 'endDate',
            size: 100,
            header: 'Fin',
            Cell: ({ cell }): React.JSX.Element => (
              <span>{formatDayMonthYear(cell.getValue<string>())}</span>
            ),
          },
          {
            accessorKey: 'active',
            size: 100,
            header: 'Estado',
            Cell: ({ cell }): React.JSX.Element =>
              cell.getValue<boolean>() ? (
                <Badge colorScheme='green'>Vigente</Badge>
              ) : (
                <Badge colorScheme='gray'>No vigente</Badge>
              ),
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
              <Button
                as={Link_Next}
                href={`/dashboard/client/shipping-contracts/${row.original.id}`}
                size='sm'
                variant='outline'
                colorScheme='green'
              >
                Editar
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
    enableColumnDragging: false,
    enableHiding: false,
    enableColumnPinning: true,
    layoutMode: 'grid',
    enableColumnActions: false,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      columnPinning: { right: ['active', 'edit'] },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '575px' } },
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableShippingContracts;
