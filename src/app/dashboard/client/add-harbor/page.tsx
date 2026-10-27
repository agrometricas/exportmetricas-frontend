'use client';
import React from 'react';
import { MdAnchor } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddHarborForm from '../../../../components/settings/AddHarborForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddHarborPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdAnchor}
      title='Agregar Nuevo Puerto'
      description='Completa el formulario para registrar un puerto'
    >
      <AddHarborForm />
    </CardPage>
  );
}

export default IsOnboarding(AddHarborPage);
