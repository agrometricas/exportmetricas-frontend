'use client';

import {
  Alert,
  Button,
  Text,
  Textarea,
  VStack,
  Field,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import { useCancelExport } from '../../hooks/export/cancelExport';
import { ExportResponse } from '../../types/export.response';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const REASON_MAX_LENGTH = 300;

const AFFECTED_QUERIES = [
  'exports',
  'export',
  'exportProgress',
  'workQueue',
  'exportsPending',
  'exportsSent',
  'exportsSentPending',
  'cuttingSheetsPending',
  'exportSentCostsPending',
  'clientPaymentsPending',
  'exporterMaterialStock',
  'businessStock',
  'stockMovements',
  'bookings',
  'purchaseOrders',
  'purchaseOrder',
  'contractUsage',
  'contractUsageCheck',
  'lastFarmExport',
];

interface CancelExportModalProps {
  exportToCancel: ExportResponse | null;
  onClose: () => void;
}

const CancelExportModal: React.FC<CancelExportModalProps> = ({
  exportToCancel,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: cancelExport, isPending: isLoading } = useCancelExport();

  const close = (): void => {
    setReason('');
    onClose();
  };

  const confirm = (): void => {
    if (!exportToCancel) return;
    cancelExport(
      { exportId: exportToCancel.id, reason: reason.trim() || undefined },
      {
        onSuccess: ({ data }) => {
          toaster.create({
            title: 'Exportación cancelada',
            description:
              data.returnedLines > 0
                ? `Se devolvieron ${data.returnedLines} materiales al stock de la finca.`
                : 'No tenía envío de insumos: el stock no cambió.',
            type: 'success',
            duration: 5000,
            closable: true,
          });
          AFFECTED_QUERIES.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: [key] })
          );
          close();
        },
        onError: (error) => {
          toaster.create({
            title: 'No se pudo cancelar la exportación',
            description: serverErrorMessage(error),
            type: 'error',
            duration: 6000,
            closable: true,
          });
          if (error.response?.status === 401) {
            router.push('/api/auth/signout');
          }
        },
      }
    );
  };

  const hasSupplies = exportToCancel?.pendingExportSent === false;

  return (
    <Dialog.Root
      open={!!exportToCancel}
      size='lg'
      placement='center'
      onOpenChange={(e) => {
        if (!e.open) {
          close();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              Cancelar exportación #{exportToCancel?.id}
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <VStack align='stretch' gap={4}>
                <Text fontSize='sm'>
                  {[
                    `${exportToCancel?.boxQuantity} cajas`,
                    exportToCancel?.business?.name,
                    exportToCancel?.weekDescription,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
                <Alert.Root
                  status={hasSupplies ? 'warning' : 'info'}
                  borderRadius='md'
                >
                  <Alert.Indicator />
                  <Alert.Description fontSize='sm'>
                    {hasSupplies
                      ? `El material del envío de insumos vuelve al stock de la finca ${exportToCancel?.business?.name ?? ''}. Desde Bodega decides si se reutiliza o se devuelve.`
                      : 'Todavía no tiene envío de insumos: no se mueve stock.'}
                  </Alert.Description>
                </Alert.Root>
                <Text fontSize='sm' color='fg.muted'>
                  Queda en el historial como cancelada y no admite más pasos. No
                  se puede cancelar si ya tiene pago al productor o cobro al
                  cliente.
                </Text>
                <Field.Root>
                  <Field.Label fontSize='sm'>Motivo (opcional)</Field.Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={REASON_MAX_LENGTH}
                    placeholder='Por ejemplo: el productor cambió de finca'
                    rows={3}
                  />
                  <Field.HelperText textAlign='right'>
                    {reason.length}/{REASON_MAX_LENGTH}
                  </Field.HelperText>
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer gap={3}>
              <Button variant='ghost' onClick={close} disabled={isLoading}>
                Volver
              </Button>
              <Button colorPalette='red' onClick={confirm} loading={isLoading}>
                Cancelar exportación
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CancelExportModal;
