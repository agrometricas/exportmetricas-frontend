/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, HStack, Text } from '@chakra-ui/react';
import { Box } from '@mui/material';
import {
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import DetailBoxBrand from './DetailBoxBrand';
import { useBoxBrands } from '../../../hooks/box-brand/getBoxBrands';
import { usePagination } from '../../../hooks/usePagination';
import { BoxBrandType } from '../../../types/box-brand/boxBrand';
import { formatBoxWeight } from '../../../utils/boxWeight';
import { cargoTypeLabel } from '../../../utils/cargoType';
import BoxBrandCargoModal, { CargoTarget } from '../BoxBrandCargoModal';

const TableBoxBrand = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useBoxBrands(paginationParams);
  const router = useRouter();
  const [cargoTarget, setCargoTarget] = useState<CargoTarget | null>(null);

  useEffect(() => {
    if (!!error) {
      const { response } = error as any;
      const { data: dataRes } = response;
      const { statusCode } = dataRes;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const columns = useMemo<MRT_ColumnDef<Partial<BoxBrandType>>[]>(
    () => [
      {
        header: 'Marca de Caja',
        columns: [
          {
            accessorKey: 'name',
            header: 'Nombre de la Caja',
            muiTableHeadCellProps: { style: { color: 'green' } },
          },
          {
            accessorKey: 'brand.name',
            header: 'Marca Asociada',
            muiTableHeadCellProps: { style: { color: 'green' } },
          },
        ],
      },
      {
        header: 'Detalles',
        columns: [
          {
            accessorKey: 'boxQuantity',
            header: 'Cantidad de Cajas',
          },
          {
            id: 'cargo',
            header: 'Carga y Tipo de Caja',
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
            header: 'Peso Neto por Caja',
            Cell: ({ row }): string =>
              formatBoxWeight(
                row.original.netWeightBox,
                row.original.netWeightKg
              ),
          },
          {
            accessorKey: 'grossWeightBox',
            header: 'Peso Bruto por Caja',
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
            header: 'Tipo de Sello',
          },
        ],
      },
      {
        header: 'Código',
        columns: [
          {
            accessorKey: 'brandCode',
            header: 'Código de Marca',
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
        sx={{
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
        <DetailBoxBrand
          detail={row.original}
          width={width}
          windowSize={windowSize}
        />
      </Box>
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
