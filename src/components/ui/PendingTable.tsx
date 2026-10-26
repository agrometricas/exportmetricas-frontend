'use client';

import {
  MRT_ColumnDef,
  MRT_RowData,
  MRT_RowSelectionState,
  MRT_Updater,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React from 'react';
import { idsToSelection, selectionToIds } from '../../utils/selection';

interface PendingTableProps<T extends MRT_RowData> {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  rowId: (row: T) => number;
  renderAction: (row: T) => React.ReactNode;
  selectedIds?: number[];
  onSelectedChange?: (ids: number[]) => void;
}

function PendingTable<T extends MRT_RowData>({
  columns,
  data,
  rowId,
  renderAction,
  selectedIds = [],
  onSelectedChange,
}: PendingTableProps<T>): React.JSX.Element {
  const rowSelection = idsToSelection(selectedIds);

  const onRowSelectionChange = (
    updater: MRT_Updater<MRT_RowSelectionState>
  ): void => {
    const next =
      typeof updater === 'function' ? updater(rowSelection) : updater;
    onSelectedChange?.(selectionToIds(next));
  };

  const table = useMaterialReactTable<T>({
    columns,
    data,
    localization: MRT_Localization_ES,
    getRowId: (row) => String(rowId(row)),
    enableRowSelection: !!onSelectedChange,
    onRowSelectionChange,
    state: { rowSelection },
    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => renderAction(row.original),
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Acción',
        size: 170,
        // A pinned cell is see-through by default: the columns that scroll
        // under it would show behind the button.
        muiTableHeadCellProps: {
          sx: { backgroundColor: 'background.paper', opacity: 1 },
        },
        muiTableBodyCellProps: {
          sx: { backgroundColor: 'background.paper', opacity: 1 },
        },
      },
    },
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableStickyHeader: true,
    // On a narrow screen the row scrolls sideways; its action stays in view.
    enableColumnPinning: true,
    initialState: {
      density: 'compact',
      pagination: { pageSize: 25, pageIndex: 0 },
      columnPinning: {
        left: ['mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    muiTableContainerProps: { sx: { maxHeight: '65vh' } },
  });

  return <MaterialReactTable table={table} />;
}

export default PendingTable;
