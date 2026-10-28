'use client';
import React from 'react';
import { MdPaid } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import PendingPaymentList from '../../../../components/export/export-payments/PendingPaymentList';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ExportPaymentsPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdPaid}
      title='Pagos a productores'
      description='Revisa y gestiona los pagos pendientes a productores'
      width='wide'
    >
      <PendingPaymentList />
    </CardPage>
  );
}

export default IsOnboarding(ExportPaymentsPage);
