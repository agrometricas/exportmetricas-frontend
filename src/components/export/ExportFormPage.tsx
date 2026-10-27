'use client';
import { Alert, Button, Center, Spinner } from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { MdContentCopy, MdEdit } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddExportForm from './AddExportForm';
import { useExport } from '../../hooks/export/getExport';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

interface ExportFormPageProps {
  exportId: string;
  mode: 'edit' | 'duplicate';
}

const COPY = {
  edit: {
    icon: MdEdit,
    title: 'Editar Exportación',
    subtitle: 'Cambia la finca, la alícuota o cualquier otro dato',
  },
  duplicate: {
    icon: MdContentCopy,
    title: 'Duplicar Exportación',
    subtitle: 'Se creará una exportación nueva con estos datos',
  },
};

function editBlockedReason(
  cancelledAt: string | null,
  pendingExportSent: boolean | null
): string | null {
  if (cancelledAt) return 'Esta exportación está cancelada: ya no se edita.';
  if (pendingExportSent === false) {
    return 'Esta exportación ya tiene envío de insumos: no se puede editar. Para cambiarla, cancélala y duplícala.';
  }
  return null;
}

const ExportFormPage: React.FC<ExportFormPageProps> = ({ exportId, mode }) => {
  const { data, isLoading, error } = useExport({ exportId });
  const { icon, title, subtitle } = COPY[mode];

  const blocked =
    mode === 'edit' && data
      ? editBlockedReason(data.cancelledAt, data.pendingExportSent)
      : null;

  return (
    <CardPage icon={icon} title={title} description={subtitle}>
      {isLoading && (
        <Center py={10}>
          <Spinner color='green.fg' />
        </Center>
      )}
      {!!error && (
        <Alert.Root status='error' borderRadius='md'>
          <Alert.Indicator />
          <Alert.Description>
            {serverErrorMessage(error, 'No se pudo cargar la exportación')}
          </Alert.Description>
        </Alert.Root>
      )}
      {data && blocked && (
        <Alert.Root status='warning' borderRadius='md'>
          <Alert.Indicator />
          <Alert.Description flex='1'>{blocked}</Alert.Description>
          <Button size='sm' colorPalette='green' asChild>
            <Link_Next href={`/dashboard/export/${exportId}/duplicate`}>
              <MdContentCopy />
              Duplicar
            </Link_Next>
          </Button>
        </Alert.Root>
      )}
      {data && !blocked && (
        <>
          {mode === 'edit' && data.purchaseOrderLine && (
            <Alert.Root status='info' borderRadius='md' mb={4}>
              <Alert.Indicator />
              <Alert.Description flex='1'>
                Nació de una orden de compra: la finca y la alícuota son las de
                su línea y no cambian.
              </Alert.Description>
              <Button size='sm' variant='outline' colorPalette='green' asChild>
                <Link_Next
                  href={`/dashboard/export/purchase-orders/${data.purchaseOrderLine.purchaseOrderId}`}
                >
                  Ver la orden
                </Link_Next>
              </Button>
            </Alert.Root>
          )}
          {mode === 'duplicate' && (
            <Alert.Root status='info' borderRadius='md' mb={4}>
              <Alert.Indicator />
              <Alert.Description>
                Copia de la exportación #{data.id}. Cambia lo necesario y
                guarda: la original no se modifica.
              </Alert.Description>
            </Alert.Root>
          )}
          <AddExportForm source={data} editing={mode === 'edit'} />
        </>
      )}
    </CardPage>
  );
};

export default ExportFormPage;
