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
      description='Contenedores de contrato que usó cada finca y cajas exportadas contra su cupo del MAGAP'
      width='wide'
    >
      <ContractUsageView />
    </CardPage>
  );
}

export default IsOnboarding(ContractUsagePage);
