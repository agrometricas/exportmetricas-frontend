'use client';
import React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import MinimumBoxPriceForm from '../../../../components/settings/minimum-box-price/MinimumBoxPriceForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function MinimumBoxPricePage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdAttachMoney}
      title='Precio Mínimo'
      description='Precio mínimo de sustentación por caja que se le propone al productor.'
    >
      <MinimumBoxPriceForm />
    </CardPage>
  );
}

export default IsOnboarding(MinimumBoxPricePage);
