'use client';
import React from 'react';
import { MdOutlineAgriculture } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddBusinessForm from '../../../../components/producer/AddBusinessForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBusinessPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineAgriculture}
      title='Agregar nueva finca'
      description='Completa el formulario para registrar una finca'
    >
      <AddBusinessForm />
    </CardPage>
  );
}

export default IsOnboarding(AddBusinessPage);
