'use client';
import React from 'react';
import { MdTimeline } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import StockMovementsSelector from '../../../../components/winery/StockMovementsSelector';

function StockMovementsPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdTimeline}
      title='Trazabilidad de stock'
      description='Consulta los movimientos de materiales por finca'
      width='wide'
    >
      <StockMovementsSelector />
    </CardPage>
  );
}

export default IsOnboarding(StockMovementsPage);
