'use client';
import React from 'react';
import { MdLocalShipping } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddExportForm from '../../../../components/export/AddExportForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddExportPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdLocalShipping}
      title='Agregar exportación'
      description='Completa el formulario para registrar una nueva exportación'
    >
      <AddExportForm />
    </CardPage>
  );
}

export default IsOnboarding(AddExportPage);
