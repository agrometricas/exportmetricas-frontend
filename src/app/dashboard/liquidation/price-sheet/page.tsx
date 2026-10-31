'use client';
import React from 'react';
import { MdRequestQuote } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import PriceSheetForm from '../../../../components/price-sheet/PriceSheetForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function PriceSheetPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdRequestQuote}
      title='Hoja de precios'
      description='El precio por caja de las exportaciones spot de la semana; las de contrato llevan el de su contrato. Es el que propone el pago al productor.'
      width='wide'
    >
      <PriceSheetForm />
    </CardPage>
  );
}

export default IsOnboarding(PriceSheetPage);
