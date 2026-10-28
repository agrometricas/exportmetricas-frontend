'use client';
import React from 'react';
import { MdRequestQuote } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import ExportCostList from '../../../../components/export-cost/ExportCostList';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ExportCostPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdRequestQuote}
      title='Costos de exportación'
      description='Revisa y valida los costos de exportaciones pendientes'
      width='wide'
    >
      <ExportCostList />
    </CardPage>
  );
}

export default IsOnboarding(ExportCostPage);
