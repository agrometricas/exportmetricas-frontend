'use client';
import React from 'react';
import { MdLocalShipping } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import ExportList from '../../../../components/export/ExportList';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function MaterialsExportPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdLocalShipping}
      title='Envíos de Insumos'
      description='Revisa y gestiona las exportaciones pendientes de envío'
      width='wide'
    >
      <ExportList />
    </CardPage>
  );
}

export default IsOnboarding(MaterialsExportPage);
