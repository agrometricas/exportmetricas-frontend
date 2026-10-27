/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, HStack, Text } from '@chakra-ui/react';
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
import DetailCuttingTypes from './DetailCuttingTypes';
import { useCuttingTypes } from '../../../../hooks/export/cutting-type/getCuttingTypes';
import { usePagination } from '../../../../hooks/usePagination';

const TableCuttingTypes = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useCuttingTypes(paginationParams);
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
        header: 'Corte y Calidad',
        columns: [
          {
            accessorKey: 'shipmentType',
            header: 'Tipo de Corte',
            Cell: ({ row }): React.JSX.Element => (
              <HStack gap={2}>
                <Text>{row.original.shipmentType}</Text>
                <Button
                  size='xs'
                  variant='outline'
                  colorPalette='green'
                  asChild
                >
                  <Link_Next
                    href={`/dashboard/box-brands/cutting-types/${row.original.id}`}
                  >
                    Editar
                  </Link_Next>
                </Button>
              </HStack>
            ),
          },
          {
            accessorKey: 'quality',
            header: 'Calidad',
          },
          {
            accessorKey: 'leavesAtHarvest',
            header: 'Hojas en Cosecha',
          },
          {
            accessorKey: 'maxAgeAtCut',
            header: 'Edad Máxima al Corte',
          },
          {
            accessorKey: 'fingerLength',
            header: 'Longitud del Dedo',
          },
          {
            accessorKey: 'minCaliber',
            header: 'Calibre Mínimo',
          },
          {
            accessorKey: 'maxCaliber',
            header: 'Calibre Máximo',
          },
        ],
      },
      {
        header: 'Detalles de Empaque',
        columns: [
          {
            accessorKey: 'saneos',
            header: 'Saneos por Caja',
          },
          {
            accessorKey: 'cunas',
            header: 'Cuñas por Caja',
          },
          {
            accessorKey: 'clusterDetail',
            header: 'Detalle de Clúster',
          },
          {
            accessorKey: 'labelDetail',
            header: 'Detalle de Etiqueta',
          },
        ],
      },
      {
        header: 'Primera Clasificación',
        columns: [
          {
            accessorKey: 'firstLine',
            header: 'Primera Línea',
          },
          {
            accessorKey: 'secondLine',
            header: 'Segunda Línea',
          },
          {
            accessorKey: 'thirdLine',
            header: 'Tercera Línea',
          },
          {
            accessorKey: 'fourthLine',
            header: 'Cuarta Línea',
          },
        ],
      },
      {
        header: 'Observaciones',
        columns: [
          {
            accessorKey: 'packagingPattern',
            header: 'Patrón de Empaque',
          },
          {
            accessorKey: 'generalObservations',
            header: 'Observaciones Generales',
            size: 250,
            Cell: ({ cell }): React.ReactNode => (
              <span style={{ whiteSpace: 'normal' }}>
                {cell.getValue<string>() || 'N/A'}
              </span>
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
        right: ['fingerLength'],
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
        <DetailCuttingTypes cuttingType={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableCuttingTypes;
