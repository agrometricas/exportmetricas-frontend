'use client';
import React from 'react';
import { MdVerified } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import IsOnboarding from '../../../../components/ui/IsOnboarding';
import AddVerifierForm from '../../../../components/verifier/AddVerifierForm';

function AddVerifierPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdVerified}
      title='Agregar verificadora'
      description='Completa el formulario para registrar una verificadora'
    >
      <AddVerifierForm />
    </CardPage>
  );
}

export default IsOnboarding(AddVerifierPage);
