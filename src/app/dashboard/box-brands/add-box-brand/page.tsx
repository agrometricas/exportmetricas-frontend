'use client';
import React from 'react';
import { MdOutlineInventory2 } from 'react-icons/md';
import AddBoxBrandsForm from '@/components/box-brands/AddBoxBrandsForm';
import { CardPage } from '@/components/ui/page/PageLayout';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBoxBrandPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineInventory2}
      title='Agregar Nueva Alícuota'
      description='Completa el formulario para registrar una marca de caja'
    >
      <AddBoxBrandsForm />
    </CardPage>
  );
}

export default IsOnboarding(AddBoxBrandPage);
