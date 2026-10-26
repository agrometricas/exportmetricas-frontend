import { MRT_ColumnDef, MRT_RowData } from 'material-react-table';
import { ExportType } from '../../types/export';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

type ExportOf<T> = (row: T) => Partial<ExportType> | undefined;

// The columns every pending list shares, read from wherever the row keeps its
// export: the row itself or `row.export`.
export function pendingExportColumns<T extends MRT_RowData>(
  exportOf: ExportOf<T>
): MRT_ColumnDef<T>[] {
  return [
    {
      id: 'cuttingDate',
      header: 'Corte',
      size: 110,
      accessorFn: (row) => formatDayMonthYear(exportOf(row)?.cuttingDate),
    },
    {
      id: 'farm',
      header: 'Finca',
      accessorFn: (row) => exportOf(row)?.business?.name ?? '',
    },
    {
      id: 'producer',
      header: 'Productor',
      accessorFn: (row) => exportOf(row)?.merchant?.businessName ?? '',
    },
    {
      id: 'boxBrand',
      header: 'Alícuota',
      accessorFn: (row) => exportOf(row)?.boxBrand?.name ?? '',
    },
    {
      id: 'boxes',
      header: 'Cajas',
      size: 90,
      accessorFn: (row) => exportOf(row)?.boxQuantity ?? '',
    },
    {
      id: 'client',
      header: 'Cliente',
      accessorFn: (row) => exportOf(row)?.client?.businessName ?? '',
    },
    {
      id: 'route',
      header: 'Ruta',
      accessorFn: (row) =>
        [
          exportOf(row)?.harborDeparture?.name,
          exportOf(row)?.harborDestination?.name,
        ]
          .filter(Boolean)
          .join(' → '),
    },
  ];
}

export function pendingExportLabel(item?: Partial<ExportType>): string {
  return item
    ? [
        item.business?.name,
        item.boxBrand?.name,
        item.boxQuantity ? `${item.boxQuantity} cajas` : '',
        formatDayMonthYear(item.cuttingDate),
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Exportación';
}
