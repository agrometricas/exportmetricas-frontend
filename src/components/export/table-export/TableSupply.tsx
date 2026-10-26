/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@chakra-ui/react';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo, useState } from 'react';
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
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}

interface TableSizeProps {
  sm: number | null;
  md: number | null;
}

const TableSupply = ({
  details,
  width,
  windowSize,
}: props): React.JSX.Element => {
  const [columnSize, setColumnSize] = useState<TableSizeProps>({
    sm: (Number(width.sm) - 92 - 60 - 30) / 3,
    md: (Number(width.md) - 92 - 60 - 30) / 3,
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
        accessorKey: 'needQuantity',
        header: 'Necesario',
        enableHiding: false,
        size:
          Number(windowSize.width) >= 768
            ? Number(columnSize.md)
            : Number(columnSize.sm),
      },
      {
        accessorKey: 'sentQuantity',
        header: 'Enviado',
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
      row.original.arrayNeed && row.original.arraySent ? (
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
          <DetailCocktail
            cocktailNeed={row.original.arrayNeed}
            cocktailSent={row.original.arraySent}
            width={width}
            windowSize={windowSize}
          />
        </Box>
      ) : null,
  });

  return <MaterialReactTable table={table} />;
};

export default TableSupply;
