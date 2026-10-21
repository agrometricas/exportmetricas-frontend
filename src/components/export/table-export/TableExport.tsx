/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Center,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import { Box } from '@mui/material';
import {
  MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { BsFillSendCheckFill, BsFillSendDashFill } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { MdAssignment, MdBlock, MdContentCopy, MdEdit } from 'react-icons/md';
import DetailExport from './DetailExport';
import { useExports } from '../../../hooks/export/getExports';
import { usePagination } from '../../../hooks/usePagination';
import { ExportResponse } from '../../../types/export.response';
import { CUSTOMS_STEP } from '../../../utils/customs';
import { formatDayMonthYearTime } from '../../../utils/dayMonthYear';
import CancelExportModal from '../CancelExportModal';
import ExportCustomsModal from '../ExportCustomsModal';

const TableExport = ({
  width,
  windowSize,
}: {
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], error } = useExports(paginationParams);
  const router = useRouter();
  const [toCancel, setToCancel] = useState<ExportResponse | null>(null);
  const [customsOf, setCustomsOf] = useState<ExportResponse | null>(null);

  useEffect(() => {
    if (!!error) {
      const { response } = error as any;
      const { data: dataRes } = response;
      const { statusCode } = dataRes;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const columns = useMemo<MRT_ColumnDef<ExportResponse>[]>(
    () => [
      {
        header: 'Exportación',
        columns: [
          { accessorKey: 'boxQuantity', header: 'Cajas' },
          { accessorKey: 'boxBrand.name', header: 'Caja' },
          { accessorKey: 'boxBrand.brand.name', header: 'Marca' },
          { accessorKey: 'boxBrand.brandCode', header: 'Código Marca' },
          { accessorKey: 'shipName', header: 'Barco' },
          { accessorKey: 'bookingNumber', header: 'Booking' },
          {
            accessorKey: 'shippingDateTime',
            header: 'Fecha Máxima de Ingreso',
            Cell: ({ cell }) => (
              <span>{formatDayMonthYearTime(cell.getValue<string>())}</span>
            ),
          },
        ],
      },
      {
        header: 'Productor/Finca',
        columns: [
          { accessorKey: 'merchant.businessName', header: 'Productor' },
          { accessorKey: 'merchant.businessId', header: 'RUC' },
          { accessorKey: 'business.name', header: 'Finca' },
          { accessorKey: 'business.city.name', header: 'Ciudad Finca' },
        ],
      },
      {
        header: 'Cliente',
        columns: [
          { accessorKey: 'client.businessName', header: 'Razón Social' },
          { accessorKey: 'client.businessId', header: 'RUC' },
          {
            accessorKey: 'client.email',
            header: 'Email',
            enableClickToCopy: true,
          },
          {
            accessorKey: 'client.phone',
            header: 'Teléfono',
            enableClickToCopy: true,
          },
        ],
      },
      {
        header: 'Puertos',
        columns: [
          { accessorKey: 'harborDeparture.name', header: 'Salida' },
          { accessorKey: 'harborDestination.name', header: 'Destino' },
        ],
      },
      {
        header: 'Envío',
        columns: [
          {
            id: 'enviado',
            header: 'Estado',
            accessorFn: (row) => `${row.pendingExportSent}`,
            Cell: ({ renderedCellValue, row }) => (
              <Center>
                {row.original.cancelledAt ? (
                  <Badge colorScheme='red'>Cancelada</Badge>
                ) : renderedCellValue === 'false' ? (
                  <BsFillSendCheckFill color='green' />
                ) : (
                  <BsFillSendDashFill color='orange' />
                )}
              </Center>
            ),
          },
          {
            id: 'aduana',
            header: 'Aduana',
            size: 100,
            accessorFn: (row) => row.customsStep ?? 'PENDING',
            Cell: ({ row }): React.JSX.Element => {
              const step = CUSTOMS_STEP[row.original.customsStep ?? 'PENDING'];
              return (
                <Center>
                  <Badge colorScheme={step.colorScheme}>{step.label}</Badge>
                </Center>
              );
            },
          },
        ],
      },
      {
        id: 'acciones',
        header: 'Acciones',
        size: 90,
        enableSorting: false,
        Cell: ({ row }): React.JSX.Element => {
          const { id, cancelledAt, pendingExportSent } = row.original;
          const canEdit = !cancelledAt && pendingExportSent !== false;
          return (
            <Center>
              <Menu isLazy placement='bottom-end'>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  aria-label='Acciones de la exportación'
                  size='sm'
                  variant='ghost'
                />
                <Portal>
                  <MenuList zIndex='popover'>
                    <MenuItem
                      icon={<MdEdit />}
                      isDisabled={!canEdit}
                      onClick={() =>
                        router.push(`/dashboard/export/${id}/edit`)
                      }
                    >
                      {canEdit
                        ? 'Editar'
                        : cancelledAt
                          ? 'Editar (está cancelada)'
                          : 'Editar (ya tiene envío de insumos)'}
                    </MenuItem>
                    <MenuItem
                      icon={<MdAssignment />}
                      isDisabled={!!cancelledAt}
                      onClick={() => setCustomsOf(row.original)}
                    >
                      AUCP y DAE
                    </MenuItem>
                    <MenuItem
                      icon={<MdContentCopy />}
                      onClick={() =>
                        router.push(`/dashboard/export/${id}/duplicate`)
                      }
                    >
                      Duplicar
                    </MenuItem>
                    <MenuItem
                      icon={<MdBlock />}
                      color='red.500'
                      isDisabled={!!cancelledAt}
                      onClick={() => setToCancel(row.original)}
                    >
                      Cancelar
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Center>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        left: ['mrt-row-expand', 'boxQuantity'],
        right: ['enviado', 'aduana', 'acciones'],
      },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '100%' } },
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
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          left: '0px',
          maxWidth:
            Number(windowSize.width) >= 768 ? `${width.md}px` : `${width.sm}px`,
          position: 'sticky',
          width: '100%',
        }}
      >
        <DetailExport data={row.original} width={width} />
      </Box>
    ),
    localization: MRT_Localization_ES,
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <CancelExportModal
        exportToCancel={toCancel}
        onClose={() => setToCancel(null)}
      />
      <ExportCustomsModal
        exportItem={customsOf}
        onClose={() => setCustomsOf(null)}
      />
    </>
  );
};

export default TableExport;
