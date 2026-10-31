'use client';
import React, { Suspense } from 'react';
import { MdOutlineViewWeek } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import WeekDemandView from '../../../../components/purchase-order/WeekDemandView';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function PurchaseOrderWeekPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineViewWeek}
      title='Pedidos de la semana'
      description='Lo que pidió cada cliente contra lo ya asignado a las fincas'
      width='wide'
    >
      <Suspense fallback={<LoadingState />}>
        <WeekDemandView />
      </Suspense>
    </CardPage>
  );
}

export default IsOnboarding(PurchaseOrderWeekPage);
