import { isAxiosError } from 'axios';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailClients from './DetailClients';
import { useClients } from '../../../hooks/export/client/getClients';
import { usePagination } from '../../../hooks/usePagination';
import { ClientResponse } from '../../../types/client.response';

const TableClients = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useClients(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const dataRes = error.response?.data;
      if (dataRes?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<ClientResponse>[]>(() => [
    {
      header: 'Cliente',
      columns: [
        {
          accessorKey: 'businessName',
          header: 'Nombre Cliente',
        },
        {
          accessorKey: 'businessId',
          header: 'RUC',
        },
        {
          accessorKey: 'type',
          header: 'Tipo de Negocio',
        },
        {
          accessorKey: 'commercialType',
          header: 'Tipo Comercial',
        },
      ],
    },
    {
      header: 'Contacto',
      columns: [
        {
          accessorKey: 'email',
          header: 'Correo Electrónico',
        },
        {
          accessorKey: 'phone',
          header: 'Teléfono',
        },
        {
          accessorKey: 'contacts',
          header: 'Contactos',
          Cell: ({ cell }): React.ReactNode => {
            const contacts = cell.getValue<ClientResponse['contacts']>();
            return (
              <span>
                {contacts?.map((c) => `${c.name} (${c.role})`).join(', ') || 'N/A'}
              </span>
            );
          },
        },
      ],
    },
    {
      header: 'Ubicación',
      columns: [
        {
          accessorKey: 'address',
          header: 'Dirección',
        },
        {
          accessorKey: 'postalCode',
          header: 'Código Postal',
        },
        {
          accessorKey: 'country.name',
          header: 'País',
        },
        {
          accessorKey: 'province.name',
          header: 'Provincia',
        },
        {
          accessorKey: 'city.name',
          header: 'Ciudad',
        },
      ],
    },
    {
      header: 'Envío',
      columns: [
        {
          accessorKey: 'shippingMethod',
          header: 'Método de Envío',
        },
        {
          accessorKey: 'harbors',
          header: 'Puertos',
          Cell: ({ cell }): React.ReactNode => {
            const harbors = cell.getValue<ClientResponse['harbors']>();
            return (
              <span>
                {harbors?.map((h) => h.name).join(', ') || 'N/A'}
              </span>
            );
          },
        },
        {
          accessorKey: 'incoterms',
          header: 'Incoterms',
          Cell: ({ cell }): React.ReactNode => {
            const incoterms = cell.getValue<ClientResponse['incoterms']>();
            const count = incoterms?.length ?? 0;
            return <span>{count > 0 ? `${count} asignado${count > 1 ? 's' : ''}` : 'Ninguno'}</span>;
          },
        },
      ],
    },
    {
      header: 'Certificados',
      columns: [
        {
          accessorKey: 'certificates',
          header: 'Certificados',
          Cell: ({ cell }): React.ReactNode => {
            const certs = cell.getValue<ClientResponse['certificates']>();
            const count = certs?.length ?? 0;
            return <span>{count > 0 ? `${count} asignado${count > 1 ? 's' : ''}` : 'Ninguno'}</span>;
          },
        },
      ],
    },
  ], []);

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
        right: ['type'],
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
        <DetailClients client={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableClients;
