'use client';
import React from 'react';
import { MdRequestQuote } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import PendingPaymentList from '../../../../components/client-payment/ClientPendingPaymentList';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ClientPaymentsPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdRequestQuote}
      title='Cobros a clientes'
      description='Revisa y gestiona los cobros pendientes de clientes'
      width='wide'
    >
      <PendingPaymentList />
    </CardPage>
  );
}

export default IsOnboarding(ClientPaymentsPage);
