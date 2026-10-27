'use client';
import { redirect, useParams, usePathname } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import PendingPaymentForm from '../../../../../components/export/export-payments/PendingPaymentForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExportSent } from '../../../../../hooks/export/export-sent/getExportSent';
import { ExportSentType } from '../../../../../types/exportSent';

function ExportPaymentPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useExportSent({
    exportSentId: params.id,
  });
  const pendingPayment = data as Partial<ExportSentType>;
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!pendingPayment || !pendingPayment.pendingProducerPayment) {
        return redirect(pathname.replace(/\/\d+$/, ''));
      }
    }
  }, [isLoading, pendingPayment, pathname]);

  if (isLoading) {
    return <LoadingState minH='60vh' />;
  }

  return (
    <CardPage
      icon={FiDollarSign}
      title='Pago a productores'
      description='Registra y confirma el pago del envío seleccionado'
    >
      <PendingPaymentForm
        paymentSelected={pendingPayment}
        pathname={pathname}
      />
    </CardPage>
  );
}

export default IsOnboarding(ExportPaymentPage);
