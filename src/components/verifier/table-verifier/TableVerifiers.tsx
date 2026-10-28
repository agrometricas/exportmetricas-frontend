import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import React, { useMemo } from 'react';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailVerifiers from './DetailVerifiers';
import { useVerifiers } from '../../../hooks/verifier/getVerifiers';
import { VerifierResponse } from '../../../types/verifier/verifier.response';

const TableVerifiers = (): React.JSX.Element => {
  const { data = [] } = useVerifiers();

  const columns = useMemo<MRT_ColumnDef<VerifierResponse>[]>(
    () => [
      {
        header: 'Verificadora',
        columns: [
          {
            accessorKey: 'name',
            header: 'Nombre',
          },
          {
            accessorKey: 'ruc',
            header: 'RUC',
          },
          {
            accessorKey: 'address',
            header: 'Dirección',
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
              const contacts = cell.getValue<VerifierResponse['contacts']>();

              if (!contacts?.length) return 'Ninguno';

              return (
                <span>
                  {contacts.map((contact, index) => (
                    <span key={index}>
                      <strong>Nombre:</strong> {contact.name},{' '}
                      <strong>Correo:</strong> {contact.email},{' '}
                      <strong>Teléfono:</strong> {contact.phone}
                      {index < contacts.length - 1 && ' | '}
                    </span>
                  ))}
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
        right: ['ruc'],
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
        <DetailVerifiers verifier={row.original} />
      </TableDetailPanel>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableVerifiers;
