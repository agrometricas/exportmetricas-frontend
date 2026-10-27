import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailTransports from './DetailTransports';
import { useTransports } from '../../../hooks/transport/getTransports';
import { TransportResponse } from '../../../types/transport/transport.response';

const TableTransports = (): React.JSX.Element => {
  const { data = [] } = useTransports();

  const columns = useMemo<MRT_ColumnDef<TransportResponse>[]>(
    () => [
      {
        header: 'Transportista',
        columns: [
          { accessorKey: 'name', header: 'Nombre' },
          { accessorKey: 'ruc', header: 'RUC' },
          { accessorKey: 'address', header: 'Dirección' },
        ],
      },
      {
        header: 'Rastreo',
        columns: [
          {
            accessorKey: 'satelliteTracking',
            header: 'Rastreo satelital',
            Cell: ({ cell }) => (cell.getValue<boolean>() ? 'Sí' : 'No'),
          },
        ],
      },
      {
        header: 'Certificaciones',
        columns: [
          {
            accessorKey: 'transportCertifications',
            header: 'Certificados',
            Cell: ({ cell }): React.ReactNode => {
              const certs =
                cell.getValue<TransportResponse['transportCertifications']>();
              if (!certs || certs.length === 0) return <span>Ninguno</span>;

              const count = certs.length;
              const label = `${count} asignado${count > 1 ? 's' : ''}`;
              const names = certs.map((c) => c.certification.name).join(', ');

              return (
                <span>
                  {label}: {names}
                </span>
              );
            },
          },
        ],
      },
      {
        header: 'Contacto',
        columns: [
          {
            accessorKey: 'contacts',
            header: 'Contactos',
            Cell: ({ cell }): React.ReactNode => {
              const contacts = cell.getValue<TransportResponse['contacts']>();
              return (
                <span>
                  {contacts?.map((contact) => contact.name).join(', ') || 'N/A'}
                </span>
              );
            },
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
        right: ['satelliteTracking'],
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
        <DetailTransports transport={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableTransports;
