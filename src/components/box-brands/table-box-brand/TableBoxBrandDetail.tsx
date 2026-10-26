/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@mui/material';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo, useState } from 'react';
import ExpandDetail from './ExpandDetail';
import { InsecticideCocktailPart } from '../../../types/box-brand/additions/insecticideCocktailPart';
import { SheetCocktail } from '../../../types/box-brand/additions/sheet';
import { StickerCocktail } from '../../../types/box-brand/additions/sticker';
import { PesticideCocktailPart } from '../../../types/box-brand/post-harvest/pesticideCocktailPart';
import { RequiredCertificateType } from '../../../types/box-brand/specifications/requiredCertificate';

interface ObjectType {
  activeIngredient?: string;
  art?: string;
  code?: string;
  color?: string;
  description?: string;
  dimensions?: string;
  dose?: number;
  id?: number;
  name?: string;
  quantityPerPack?: number;
  quantityPerRoll?: number;
  type?: string;
  weightPerPack?: number;
}

interface DetailType {
  name: string;
  quantity: string;
  object?: ObjectType;
  array?:
    | PesticideCocktailPart[]
    | InsecticideCocktailPart[]
    | RequiredCertificateType[]
    | StickerCocktail[]
    | SheetCocktail[];
}

interface TableSizeProps {
  sm: number | null;
  md: number | null;
}

const TableBoxBrandDetail = ({
  details,
  width,
  windowSize,
}: {
  details: DetailType[];
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const [columnSize, setColumnSize] = useState<TableSizeProps>({
    sm: (Number(width.sm) - 92 - 60) / 2,
    md: (Number(width.md) - 92 - 60) / 2,
  });

  const columns = useMemo<MRT_ColumnDef<Partial<DetailType>>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        enableHiding: false,
        size:
          Number(windowSize.width) >= 768
            ? Number(columnSize.md)
            : Number(columnSize.sm),
      },
      {
        accessorKey: 'quantity',
        header: 'Cantidad',
        enableHiding: false,
        size:
          Number(windowSize.width) >= 768
            ? Number(columnSize.md)
            : Number(columnSize.sm),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useMaterialReactTable({
    localization: MRT_Localization_ES,
    columns,
    data: details,
    enableBottomToolbar: false,
    enableColumnFilters: false,
    enableCellActions: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    initialState: {
      pagination: { pageSize: 30, pageIndex: 0 },
      columnPinning: {
        left: ['mrt-row-expand'],
      },
      density: 'compact',
    },
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
    renderDetailPanel: ({ row }) =>
      row.original.object || row.original.array ? (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-around',
            left: '0px',
            maxWidth:
              Number(windowSize.width) >= 768
                ? `${Number(width.md - 92)}px`
                : `${Number(width.sm - 92)}px`,
            position: 'sticky',
            width: '100%',
          }}
        >
          <ExpandDetail
            detail={(row.original.object as ObjectType) || row.original.array}
          />
        </Box>
      ) : null,
  });

  return <MaterialReactTable table={table} />;
};

export default TableBoxBrandDetail;
