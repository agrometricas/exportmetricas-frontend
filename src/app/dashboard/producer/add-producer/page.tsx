'use client';
import React from 'react';
import { MdOutlineAgriculture } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddProducerForm from '../../../../components/producer/addProducerForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddProductorPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineAgriculture}
      title='Agregar Nuevo Productor'
      description='Completa el formulario para registrar un productor'
    >
      <AddProducerForm />
    </CardPage>
  );
}

export default IsOnboarding(AddProductorPage);
