import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
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

export interface BoxBrandDetailRow {
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

const TableBoxBrandDetail = ({
  details,
}: {
  details: BoxBrandDetailRow[];
}): React.JSX.Element => {
  const columns = useMemo<MRT_ColumnDef<Partial<BoxBrandDetailRow>>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        enableHiding: false,
      },
      {
        accessorKey: 'quantity',
        header: 'Cantidad',
        enableHiding: false,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    localization: MRT_Localization_ES,
    columns,
    layoutMode: 'grid',
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
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) =>
      row.original.object || row.original.array ? (
        <TableDetailPanel>
          <ExpandDetail
            detail={(row.original.object as ObjectType) || row.original.array}
          />
        </TableDetailPanel>
      ) : null,
  });

  return <MaterialReactTable table={table} />;
};

export default TableBoxBrandDetail;
