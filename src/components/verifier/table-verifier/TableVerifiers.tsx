import { Box } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import DetailVerifiers from './DetailVerifiers';
import { usePagination } from '../../../hooks/usePagination';
import { useVerifiers } from '../../../hooks/verifier/getVerifiers';
import { VerifierResponse } from '../../../types/verifier/verifier.response';

const TableVerifiers = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useVerifiers(paginationParams);
  const router = useRouter();

  useEffect(() => {
    if (error && isAxiosError(error)) {
      const dataRes = error.response?.data;
      if (dataRes?.statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const columns = useMemo<MRT_ColumnDef<VerifierResponse>[]>(() => [
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
        right: ['ruc'],
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
          width: '100%'
        }}
      >
        <DetailVerifiers verifier={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return <MaterialReactTable table={table} />;
};

export default TableVerifiers;
