// app/(dashboard)/dashboard/client/add-deposit/page.tsx
'use client';
import React from 'react';
import { MdWarehouse } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddDepositForm from '../../../../components/deposit/AddDepositForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddDepositPage(): React.JSX.Element {
  // Theming

  return (
    <CardPage
      icon={MdWarehouse}
      title='Agregar depósito nuevo'
      description='Completa el formulario para registrar un depósito'
    >
      <AddDepositForm />
    </CardPage>
  );
}

export default IsOnboarding(AddDepositPage);
