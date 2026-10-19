'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useCancelExport } from '../../hooks/export/cancelExport';
import { ExportResponse } from '../../types/export.response';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const REASON_MAX_LENGTH = 300;

const AFFECTED_QUERIES = [
  'exports',
  'export',
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
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: cancelExport, isLoading } = useCancelExport();

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
          toast({
            title: 'Exportación cancelada',
            description:
              data.returnedLines > 0
                ? `Se devolvieron ${data.returnedLines} materiales al stock de la finca.`
                : 'No tenía envío de insumos: el stock no cambió.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          AFFECTED_QUERIES.forEach((key) => queryClient.invalidateQueries(key));
          close();
        },
        onError: (error) => {
          toast({
            title: 'No se pudo cancelar la exportación',
            description: serverErrorMessage(error),
            status: 'error',
            duration: 6000,
            isClosable: true,
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
    <Modal isOpen={!!exportToCancel} onClose={close} size='lg' isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cancelar exportación #{exportToCancel?.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align='stretch' spacing={4}>
            <Text fontSize='sm'>
              {[
                `${exportToCancel?.boxQuantity} cajas`,
                exportToCancel?.business?.name,
                exportToCancel?.weekDescription,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Text>
            <Alert status={hasSupplies ? 'warning' : 'info'} borderRadius='md'>
              <AlertIcon />
              <AlertDescription fontSize='sm'>
                {hasSupplies
                  ? `El material del envío de insumos vuelve al stock de la finca ${exportToCancel?.business?.name ?? ''}. Desde Bodega decides si se reutiliza o se devuelve.`
                  : 'Todavía no tiene envío de insumos: no se mueve stock.'}
              </AlertDescription>
            </Alert>
            <Text fontSize='sm' color='gray.600'>
              Queda en el historial como cancelada y no admite más pasos. No se
              puede cancelar si ya tiene pago al productor o cobro al cliente.
            </Text>
            <FormControl>
              <FormLabel fontSize='sm'>Motivo (opcional)</FormLabel>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={REASON_MAX_LENGTH}
                placeholder='Por ejemplo: el productor cambió de finca'
                rows={3}
              />
              <FormHelperText textAlign='right'>
                {reason.length}/{REASON_MAX_LENGTH}
              </FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant='ghost' onClick={close} isDisabled={isLoading}>
            Volver
          </Button>
          <Button colorScheme='red' onClick={confirm} isLoading={isLoading}>
            Cancelar exportación
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelExportModal;
