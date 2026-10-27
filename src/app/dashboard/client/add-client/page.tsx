'use client';
import React from 'react';
import { MdPeopleOutline } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddClientForm from '../../../../components/settings/AddClientForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddClientPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdPeopleOutline}
      title='Agregar nuevo cliente'
      description='Completa el formulario para registrar un cliente'
    >
      <AddClientForm />
    </CardPage>
  );
}

export default IsOnboarding(AddClientPage);
