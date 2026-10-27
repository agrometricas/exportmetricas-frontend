'use client';
import React from 'react';
import { MdContentCut } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import PendingCuttingSheetList from '../../../../components/export/cutting-sheet/PendingCuttingSheetList';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

const CuttingSheetsPage = (): React.JSX.Element => {
  return (
    <CardPage
      icon={MdContentCut}
      title='Hojas de Corte'
      description='Revisa y gestiona las hojas de corte pendientes'
      width='wide'
    >
      <PendingCuttingSheetList />
    </CardPage>
  );
};

export default IsOnboarding(CuttingSheetsPage);
