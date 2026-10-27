import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailShippingCompanies from './DetailShippingCompanies';
import { useShippingCompanies } from '../../../hooks/export/shippingCompany/getShippingCompanies';
import { ShippingCompanyResponse } from '../../../types/shippingCompany.response';

const TableShippingCompanies = (): React.JSX.Element => {
  const { data = [] } = useShippingCompanies();

  const columns = useMemo<MRT_ColumnDef<ShippingCompanyResponse>[]>(
    () => [
      {
        header: 'Compañía naviera',
        columns: [
          { accessorKey: 'name', header: 'Nombre' },
          { accessorKey: 'code', header: 'Código' },
          { accessorKey: 'frequencies', header: 'Frecuencia' },
          { accessorKey: 'cargoType', header: 'Tipo de carga' },
          {
            accessorKey: 'trackingPlatform',
            header: 'Plataforma tracking',
            Cell: ({ cell }): React.ReactNode => {
              const value = cell.getValue<string>();
              return value ? (
                <a href={value} target='_blank' rel='noopener noreferrer'>
                  {value}
                </a>
              ) : (
                'No disponible'
              );
            },
          },
        ],
      },
      {
        header: 'Ubicación',
        columns: [
          {
            accessorFn: (row) => row.country.name,
            header: 'País',
          },
        ],
      },
      {
        header: 'Contactos',
        columns: [
          {
            accessorFn: (row) =>
              row.contacts.map((c) => c.name).join(', ') || 'N/A',
            header: 'Nombres',
          },
          {
            accessorFn: (row) =>
              row.contacts.map((c) => c.phone).join(', ') || 'N/A',
            header: 'Teléfono',
          },
        ],
      },
      {
        header: 'Puertos',
        columns: [
          {
            accessorFn: (row): string => {
              return row.harbors.length > 0
                ? `${row.harbors.length} ruta${row.harbors.length > 1 ? 's' : ''}`
                : 'Ninguna';
            },
            header: 'Rutas asignadas',
          },
          {
            accessorFn: (row): string => {
              return row.harbors
                .map(
                  (h) =>
                    `${h.harborDeparture.name} → ${h.harborDestination.name}`
                )
                .join(', ');
            },
            header: 'Origen → destino',
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
        right: ['code'],
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
        <DetailShippingCompanies company={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableShippingCompanies;
