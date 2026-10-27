'use client';
import React from 'react';
import { MdWarningAmber } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import ContractUsageView from '../../../../components/contract-usage/ContractUsageView';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ContractUsagePage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdWarningAmber}
      title='Cupos de la semana'
      description='Cajas exportadas por cada finca contra las aprobadas en su contrato'
      width='wide'
    >
      <ContractUsageView />
    </CardPage>
  );
}

export default IsOnboarding(ContractUsagePage);
