'use client';
import { Badge, Box, Button, Heading, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { MdLocalShipping } from 'react-icons/md';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import { pendingExportColumns, pendingExportLabel } from './pendingColumns';
import { useCreateExportSentBatch } from '../../hooks/export/export-sent/createExportSentBatch';
import { useExportsPending } from '../../hooks/export/getExportsPending';
import { ExportType } from '../../types/export';
import { shipmentBatchSummary } from '../../utils/shipmentBatch';
import BatchActionBar from '../ui/BatchActionBar';
import PendingTable from '../ui/PendingTable';

const SHIPMENT_QUERIES = [
  'exports',
  'export',
  'exportsPending',
  'exportsSent',
  'exportsSentPending',
  'cuttingSheets',
  'cuttingSheetsPending',
  'exportSentCostsPending',
  'clientPaymentsPending',
  'exporterMaterialStock',
  'businessStock',
  'stockMovements',
  'exportProgress',
  'workQueue',
];

const ExportList = (): React.JSX.Element => {
  const { data = [], isLoading, error, refetch } = useExportsPending();
  const pathname = usePathname();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { mutateAsync, isPending: isSending } = useCreateExportSentBatch();
  const columns = useMemo(
    () => pendingExportColumns<Partial<ExportType>>((row) => row),
    []
  );

  const headingColor = 'fg.heading';

  if (isLoading) {
    return <LoadingState minH='40vh' />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const items = data as Partial<ExportType>[];
  const selected = items.filter((item) =>
    selectedIds.includes(Number(item.id))
  );

  return (
    <VStack gap={4} align='stretch'>
      <Box
        display='flex'
        alignItems='center'
        gap={3}
        justifyContent='space-between'
        w='100%'
      >
        <Heading size='md' color={headingColor}>
          Exportaciones pendientes
        </Heading>
        <Badge
          colorPalette='green'
          variant='subtle'
          px={3}
          py={1}
          borderRadius='full'
        >
          {items.length} {items.length === 1 ? 'pendiente' : 'pendientes'}
        </Badge>
      </Box>

      {items.length > 0 && (
        <BatchActionBar
          selected={selected}
          keyOf={(item) => Number(item.id)}
          labelOf={pendingExportLabel}
          hint='Elige en la tabla las que salen con lo que propone su alícuota. Para cambiar una cantidad, abre esa exportación.'
          icon={<MdLocalShipping />}
          actionLabel='Enviar lo propuesto'
          confirmTitle='Enviar los insumos propuestos'
          confirmText={(count) =>
            `Se registra el envío de ${count === 1 ? '1 exportación' : `${count} exportaciones`} con las cantidades que propone cada alícuota, y se descuenta del stock de cada finca.`
          }
          confirmLabel={(count) =>
            `Registrar ${count === 1 ? '1 envío' : `${count} envíos`}`
          }
          failuresTitle='Quedaron sin enviar'
          errorTitle='No se pudo registrar el lote'
          affectedQueries={SHIPMENT_QUERIES}
          isRunning={isSending}
          run={async (ids) => {
            const result = await mutateAsync(ids);
            return {
              failed: result.failed.map(({ exportId, message }) => ({
                id: exportId,
                message,
              })),
              summary: shipmentBatchSummary(result),
            };
          }}
          onFinished={setSelectedIds}
        />
      )}

      {items.length === 0 ? (
        <EmptyState
          title='No hay exportaciones pendientes de envío'
          description='Cada exportación nueva aparece aquí para registrar sus insumos.'
        />
      ) : (
        <PendingTable
          columns={columns}
          data={items}
          rowId={(item) => Number(item.id)}
          selectedIds={selectedIds}
          onSelectedChange={setSelectedIds}
          renderAction={(item) => (
            <Button size='sm' colorPalette='green' asChild>
              <NextLink href={`${pathname}/${item.id}`}>
                Realizar envío
              </NextLink>
            </Button>
          )}
        />
      )}
    </VStack>
  );
};

export default ExportList;
