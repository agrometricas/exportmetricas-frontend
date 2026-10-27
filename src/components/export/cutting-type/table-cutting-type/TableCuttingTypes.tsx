/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, HStack, Text } from '@chakra-ui/react';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Link_Next from 'next/link';
import React, { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailCuttingTypes from './DetailCuttingTypes';
import { useCuttingTypes } from '../../../../hooks/export/cutting-type/getCuttingTypes';

const TableCuttingTypes = (): React.JSX.Element => {
  const { data = [] } = useCuttingTypes();

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: 'Corte y calidad',
        columns: [
          {
            accessorKey: 'shipmentType',
            header: 'Tipo de corte',
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
            header: 'Hojas en cosecha',
          },
          {
            accessorKey: 'maxAgeAtCut',
            header: 'Edad máxima al corte',
          },
          {
            accessorKey: 'fingerLength',
            header: 'Longitud del dedo',
          },
          {
            accessorKey: 'minCaliber',
            header: 'Calibre mínimo',
          },
          {
            accessorKey: 'maxCaliber',
            header: 'Calibre máximo',
          },
        ],
      },
      {
        header: 'Detalles de empaque',
        columns: [
          {
            accessorKey: 'saneos',
            header: 'Saneos por caja',
          },
          {
            accessorKey: 'cunas',
            header: 'Cuñas por caja',
          },
          {
            accessorKey: 'clusterDetail',
            header: 'Detalle de clúster',
          },
          {
            accessorKey: 'labelDetail',
            header: 'Detalle de etiqueta',
          },
        ],
      },
      {
        header: 'Primera clasificación',
        columns: [
          {
            accessorKey: 'firstLine',
            header: 'Primera línea',
          },
          {
            accessorKey: 'secondLine',
            header: 'Segunda línea',
          },
          {
            accessorKey: 'thirdLine',
            header: 'Tercera línea',
          },
          {
            accessorKey: 'fourthLine',
            header: 'Cuarta línea',
          },
        ],
      },
      {
        header: 'Observaciones',
        columns: [
          {
            accessorKey: 'packagingPattern',
            header: 'Patrón de empaque',
          },
          {
            accessorKey: 'generalObservations',
            header: 'Observaciones generales',
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
