'use client';
import React from 'react';
import { MdTune } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import AdjustWeeklySelector from '../../../../components/winery/AdjustWeeklySelector';

function AdjustWeeklyPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdTune}
      title='Ajuste Semanal'
      description='Realiza ajustes semanales de stock por finca'
      width='wide'
    >
      <AdjustWeeklySelector />
    </CardPage>
  );
}

export default IsOnboarding(AdjustWeeklyPage);
