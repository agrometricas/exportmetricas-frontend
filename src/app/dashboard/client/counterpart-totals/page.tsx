'use client';
import React from 'react';
import { MdInsights } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import CounterpartTotalsView from '../../../../components/counterpart-totals/CounterpartTotalsView';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function CounterpartTotalsPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdInsights}
      title='Totales por Contraparte'
      description='Cajas, contenedores y montos de un período por cliente, productor, finca, puerto, naviera, depósito y verificadora'
      width='wide'
    >
      <CounterpartTotalsView />
    </CardPage>
  );
}

export default IsOnboarding(CounterpartTotalsPage);
