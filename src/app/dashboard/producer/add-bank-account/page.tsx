'use client';
import React from 'react';
import { MdOutlineAccountBalance } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddBankAccountForm from '../../../../components/producer/AddBankAccountForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBankAccountPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineAccountBalance}
      title='Agregar cuenta bancaria'
      description='Completa el formulario para registrar una cuenta bancaria'
    >
      <AddBankAccountForm />
    </CardPage>
  );
}

export default IsOnboarding(AddBankAccountPage);
