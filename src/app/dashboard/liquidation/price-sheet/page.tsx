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
      title='Hoja de Precios'
      description='El precio por caja de cada línea de las órdenes de compra de la semana: es el que propone el pago al productor.'
      width='wide'
    >
      <PriceSheetForm />
    </CardPage>
  );
}

export default IsOnboarding(PriceSheetPage);
