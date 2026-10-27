/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Center, IconButton, Menu, Portal } from '@chakra-ui/react';
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
import {
  MdAssignment,
  MdBlock,
  MdContentCopy,
  MdEdit,
  MdTimeline,
} from 'react-icons/md';
import TableDetailPanel from '@/components/ui/TableDetailPanel';
import DetailExport from './DetailExport';
import { useExports } from '../../../hooks/export/getExports';
import { ExportResponse } from '../../../types/export.response';
import { CUSTOMS_STEP } from '../../../utils/customs';
import { formatDayMonthYearTime } from '../../../utils/dayMonthYear';
import CancelExportModal from '../CancelExportModal';
import ExportCustomsModal from '../ExportCustomsModal';
import ExportDocumentsMenuItems from '../ExportDocumentsMenuItems';

const TableExport = (): React.JSX.Element => {
  const { rows: data, error, tableOptions } = useExports();
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
                  <Badge colorPalette='red'>Cancelada</Badge>
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
                  <Badge colorPalette={step.colorScheme}>{step.label}</Badge>
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
              <Menu.Root
                lazyMount
                unmountOnExit
                positioning={{
                  placement: 'bottom-end',
                }}
              >
                <Menu.Trigger asChild>
                  <IconButton
                    aria-label='Acciones de la exportación'
                    size='sm'
                    variant='ghost'
                  >
                    <FiMoreVertical />
                  </IconButton>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item
                        onSelect={() => router.push(`/dashboard/export/${id}`)}
                        value='item-0'
                      >
                        <MdTimeline />
                        Ver pasos y detalle
                      </Menu.Item>
                      <Menu.Item
                        disabled={!canEdit}
                        onSelect={() =>
                          router.push(`/dashboard/export/${id}/edit`)
                        }
                        value='item-1'
                      >
                        <MdEdit />
                        {canEdit
                          ? 'Editar'
                          : cancelledAt
                            ? 'Editar (está cancelada)'
                            : 'Editar (ya tiene envío de insumos)'}
                      </Menu.Item>
                      <Menu.Item
                        disabled={!!cancelledAt}
                        onSelect={() => setCustomsOf(row.original)}
                        value='item-2'
                      >
                        <MdAssignment />
                        AUCP y DAE
                      </Menu.Item>
                      <Menu.Item
                        onSelect={() =>
                          router.push(`/dashboard/export/${id}/duplicate`)
                        }
                        value='item-3'
                      >
                        <MdContentCopy />
                        Duplicar
                      </Menu.Item>
                      <Menu.Item
                        color='fg.error'
                        disabled={!!cancelledAt}
                        onSelect={() => setToCancel(row.original)}
                        value='item-4'
                      >
                        <MdBlock />
                        Cancelar
                      </Menu.Item>
                      <ExportDocumentsMenuItems
                        exportId={id}
                        isCancelled={!!cancelledAt}
                      />
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
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
    ...tableOptions,
    enableColumnOrdering: false,
    enableColumnFilters: false,
    enableCellActions: false,
    enableDensityToggle: false,
    enableColumnPinning: true,
    enableColumnDragging: false,
    enableHiding: false,
    initialState: {
      columnPinning: {
        left: ['mrt-row-expand', 'boxQuantity'],
        right: ['enviado', 'aduana', 'acciones'],
      },
      density: 'compact',
    },
    muiTableContainerProps: { sx: { maxHeight: '100%' } },
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    renderDetailPanel: ({ row }) => (
      <TableDetailPanel>
        <DetailExport data={row.original} />
      </TableDetailPanel>
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
