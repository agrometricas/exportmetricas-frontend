'use client';
import React from 'react';
import { MdLocalShipping } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddTransportForm from '../../../../components/transport/AddTransformForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddTransportPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdLocalShipping}
      title='Agregar transporte nuevo'
      description='Completa el formulario para registrar un transporte'
    >
      <AddTransportForm />
    </CardPage>
  );
}

export default IsOnboarding(AddTransportPage);
