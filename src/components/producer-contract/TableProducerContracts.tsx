import { Badge, Button } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Link_Next from 'next/link';
import React, { useMemo } from 'react';
import { listTableOptions } from '@/utils/listTableOptions';
import { useProducerContracts } from '../../hooks/producer-contract/getProducerContracts';
import { ProducerContractResponse } from '../../types/producerContract';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

const TableProducerContracts = (): React.JSX.Element => {
  const { data = [], ...query } = useProducerContracts();

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
        header: 'Pactado por semana',
        columns: [
          {
            accessorKey: 'weeklyContainers',
            size: 120,
            header: 'Contenedores',
            Cell: ({ cell }): React.JSX.Element => (
              <span>{cell.getValue<number | null>() ?? 'Sin dato'}</span>
            ),
          },
          {
            accessorKey: 'price',
            size: 100,
            header: 'Precio/caja',
            Cell: ({ cell }): React.JSX.Element => (
              <span>{`$${Number(cell.getValue<string>()).toFixed(2)}`}</span>
            ),
          },
        ],
      },
      {
        header: 'Cupo semanal aprobado',
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
                <Badge colorPalette='green'>Vigente</Badge>
              ) : (
                <Badge colorPalette='gray'>No vigente</Badge>
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
              <Button size='sm' variant='outline' colorPalette='green' asChild>
                <Link_Next
                  href={`/dashboard/producer/contracts/${row.original.id}`}
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
    ...listTableOptions(query),
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
