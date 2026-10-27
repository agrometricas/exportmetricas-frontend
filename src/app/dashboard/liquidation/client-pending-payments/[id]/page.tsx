'use client';
import { redirect, useParams, usePathname } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import ClientPendingPaymentForm from '../../../../../components/client-payment/ClientPendingPaymentForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExportSent } from '../../../../../hooks/export/export-sent/getExportSent';
import { ExportSentType } from '../../../../../types/exportSent';

function ClientPaymentPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useExportSent({
    exportSentId: params.id,
  });
  const pendingClientPayment = data as Partial<ExportSentType>;
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!pendingClientPayment || pendingClientPayment.pendingClientPayment) {
        return redirect(pathname.replace(/\/\d+$/, ''));
      }
    }
  }, [isLoading, pendingClientPayment, pathname]);

  if (isLoading) {
    return <LoadingState minH='60vh' />;
  }

  return (
    <CardPage
      icon={FiCreditCard}
      title='Cobro a clientes'
      description='Registra y confirma el cobro del envío seleccionado'
    >
      <ClientPendingPaymentForm
        paymentSelected={pendingClientPayment}
        pathname={pathname}
      />
    </CardPage>
  );
}

export default IsOnboarding(ClientPaymentPage);
