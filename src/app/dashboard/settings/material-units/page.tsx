'use client';
import React from 'react';
import { MdStraighten } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import MaterialUnitsForm from '../../../../components/settings/material-units/MaterialUnitsForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function MaterialUnitsPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdStraighten}
      title='Unidades de Materiales'
      description='En qué unidad se mide cada tipo de material en las alícuotas.'
    >
      <MaterialUnitsForm />
    </CardPage>
  );
}

export default IsOnboarding(MaterialUnitsPage);
