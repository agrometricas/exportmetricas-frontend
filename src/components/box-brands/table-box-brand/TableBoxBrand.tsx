import { Button, HStack, Text } from '@chakra-ui/react';
import {
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo, useState } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import { listTableOptions } from '@/utils/listTableOptions';
import DetailBoxBrand from './DetailBoxBrand';
import { useBoxBrands } from '../../../hooks/box-brand/getBoxBrands';
import { BoxBrandType } from '../../../types/box-brand/boxBrand';
import { formatBoxWeight } from '../../../utils/boxWeight';
import { cargoTypeLabel } from '../../../utils/cargoType';
import BoxBrandCargoModal, { CargoTarget } from '../BoxBrandCargoModal';

const TableBoxBrand = (): React.JSX.Element => {
  const { data = [], ...query } = useBoxBrands();
  const [cargoTarget, setCargoTarget] = useState<CargoTarget | null>(null);

  const columns = useMemo<MRT_ColumnDef<Partial<BoxBrandType>>[]>(
    () => [
      {
        header: 'Marca de caja',
        columns: [
          {
            accessorKey: 'name',
            header: 'Nombre de la caja',
            muiTableHeadCellProps: { style: { color: 'green' } },
          },
          {
            accessorKey: 'brand.name',
            header: 'Marca asociada',
            muiTableHeadCellProps: { style: { color: 'green' } },
          },
        ],
      },
      {
        header: 'Detalles',
        columns: [
          {
            accessorKey: 'boxQuantity',
            header: 'Cantidad de cajas',
          },
          {
            id: 'cargo',
            header: 'Carga y tipo de caja',
            Cell: ({ row }): React.JSX.Element => (
              <HStack gap={3}>
                <Text fontSize='sm'>
                  {cargoTypeLabel(row.original.cargoType)} ·{' '}
                  {row.original.boxType?.name ?? 'Sin tipo'}
                </Text>
                <Button
                  size='xs'
                  variant='outline'
                  colorPalette='green'
                  onClick={() =>
                    setCargoTarget({
                      id: Number(row.original.id),
                      name: row.original.name ?? '',
                      cargoType: row.original.cargoType,
                      boxType: row.original.boxType,
                    })
                  }
                >
                  Cambiar
                </Button>
              </HStack>
            ),
          },
          {
            accessorKey: 'netWeightBox',
            header: 'Peso neto por caja',
            Cell: ({ row }): string =>
              formatBoxWeight(
                row.original.netWeightBox,
                row.original.netWeightKg
              ),
          },
          {
            accessorKey: 'grossWeightBox',
            header: 'Peso bruto por caja',
            Cell: ({ row }): string =>
              formatBoxWeight(
                row.original.grossWeightBox,
                row.original.grossWeightKg
              ),
          },
          {
            accessorKey: 'seal.name',
            header: 'Sello',
          },
          {
            accessorKey: 'seal.type',
            header: 'Tipo de sello',
          },
        ],
      },
      {
        header: 'Código',
        columns: [
          {
            accessorKey: 'brandCode',
            header: 'Código de marca',
            muiTableHeadCellProps: { style: { color: 'green' } },
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
    enableColumnPinning: true,
    enableColumnDragging: false,
    enableHiding: false,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      columnPinning: {
        left: ['mrt-row-expand'],
        right: ['brandCode'],
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
        <DetailBoxBrand detail={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <BoxBrandCargoModal
        boxBrand={cargoTarget}
        onClose={() => setCargoTarget(null)}
      />
    </>
  );
};

export default TableBoxBrand;
