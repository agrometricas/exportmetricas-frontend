import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailCocktail from './DetailCocktail';
import { InsecticideCocktailPart } from '../../../types/box-brand/additions/insecticideCocktailPart';
import { PesticideCocktailPart } from '../../../types/box-brand/post-harvest/pesticideCocktailPart';
import {
  InsecticideSentPartType,
  PesticideSentPartType,
} from '../../../types/exportSent';

interface DetailType {
  name: string;
  need: string;
  sent: string;
  arrayNeed?: PesticideCocktailPart[] | InsecticideCocktailPart[];
  arraySent?: PesticideSentPartType[] | InsecticideSentPartType[];
}

interface props {
  details: DetailType[];
}

const TableSupply = ({ details }: props): React.JSX.Element => {
  const columns = useMemo<MRT_ColumnDef<Partial<DetailType>>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        enableHiding: false,
      },
      {
        accessorKey: 'needQuantity',
        header: 'Necesario',
        enableHiding: false,
      },
      {
        accessorKey: 'sentQuantity',
        header: 'Enviado',
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
      row.original.arrayNeed && row.original.arraySent ? (
        <TableDetailPanel>
          <DetailCocktail
            cocktailNeed={row.original.arrayNeed}
            cocktailSent={row.original.arraySent}
          />
        </TableDetailPanel>
      ) : null,
  });

  return <MaterialReactTable table={table} />;
};

export default TableSupply;
