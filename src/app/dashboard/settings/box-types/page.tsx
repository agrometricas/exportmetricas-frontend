'use client';
import React from 'react';
import { MdOutlineInventory2 } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import BoxTypesManager from '../../../../components/box-type/BoxTypesManager';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function BoxTypesPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineInventory2}
      title='Tipos de Caja'
      description='Los tipos de caja de la exportadora (22XU, 208…) que eligen las alícuotas.'
      width='wide'
    >
      <BoxTypesManager />
    </CardPage>
  );
}

export default IsOnboarding(BoxTypesPage);
