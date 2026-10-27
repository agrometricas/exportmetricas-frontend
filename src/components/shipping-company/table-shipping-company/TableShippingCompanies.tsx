import { Box } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { usePagination } from '@/hooks/usePagination';
import DetailShippingCompanies from './DetailShippingCompanies';
import { useShippingCompanies } from '../../../hooks/export/shippingCompany/getShippingCompanies';
import { ShippingCompanyResponse } from '../../../types/shippingCompany.response';

const TableShippingCompanies = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useShippingCompanies(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const status = error.response?.data?.statusCode;
      if (status === 401) router.push('/api/auth/signout');
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<ShippingCompanyResponse>[]>(
    () => [
      {
        header: 'Compañía Naviera',
        columns: [
          { accessorKey: 'name', header: 'Nombre' },
          { accessorKey: 'code', header: 'Código' },
          { accessorKey: 'frequencies', header: 'Frecuencia' },
          { accessorKey: 'cargoType', header: 'Tipo de Carga' },
          {
            accessorKey: 'trackingPlatform',
            header: 'Plataforma Tracking',
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
            header: 'Rutas Asignadas',
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
            header: 'Origen → Destino',
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
        css={{
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
        <DetailShippingCompanies company={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableShippingCompanies;
