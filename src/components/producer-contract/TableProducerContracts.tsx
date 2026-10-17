import { Badge, Button } from '@chakra-ui/react';
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
import { useProducerContracts } from '../../hooks/producer-contract/getProducerContracts';
import { ProducerContractResponse } from '../../types/producerContract';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

const TableProducerContracts = (): React.JSX.Element => {
  const { data = [], error } = useProducerContracts();
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<ProducerContractResponse>[]>(
    () => [
      {
        header: 'Finca',
        columns: [
          {
            accessorKey: 'business.merchant.businessName',
            size: 140,
            header: 'Productor',
          },
          { accessorKey: 'business.name', header: 'Finca', size: 145 },
        ],
      },
      {
        header: 'Cupo Semanal Aprobado',
        columns: [
          {
            accessorKey: 'approvedHectares',
            size: 110,
            header: 'Hectáreas',
            Cell: ({ cell }): React.JSX.Element => (
              <span>{`${cell.getValue<string>()} ha`}</span>
            ),
          },
          {
            accessorKey: 'approvedWeeklyBoxesPerHectare',
            size: 100,
            header: 'Cajas/ha',
          },
          {
            accessorKey: 'approvedWeeklyBoxes',
            size: 90,
            header: 'Cajas',
          },
          {
            accessorKey: 'contractType',
            size: 75,
            header: 'Tipo',
            Cell: ({ cell }): React.JSX.Element => (
              <span>{cell.getValue<string | null>() ?? '—'}</span>
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
              <span>
                {formatDayMonthYear(cell.getValue<string | null>()) ||
                  'Abierto'}
              </span>
            ),
          },
          {
            accessorKey: 'active',
            size: 115,
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
            size: 95,
            header: '',
            Cell: ({ row }): React.JSX.Element => (
              <Button
                as={Link_Next}
                href={`/dashboard/producer/contracts/${row.original.id}`}
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

export default TableProducerContracts;
