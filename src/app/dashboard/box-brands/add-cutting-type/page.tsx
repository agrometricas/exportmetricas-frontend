'use client';
import React from 'react';
import { MdContentCut } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddCuttingTypeForm from '../../../../components/export/cutting-type/AddCuttingTypeForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddCuttingTypePage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdContentCut}
      title='Agregar tipo de corte'
      description='Completa el formulario para registrar un tipo de corte'
    >
      <AddCuttingTypeForm />
    </CardPage>
  );
}

export default IsOnboarding(AddCuttingTypePage);
