'use client';
import React from 'react';
import { MdOutlineInventory2 } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddBrandForm from '../../../../components/box-brands/specifications/brand/AddBrandForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBrandPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineInventory2}
      title='Marcas de caja'
      description='Registra una marca para usarla en las alícuotas'
    >
      <AddBrandForm />
    </CardPage>
  );
}

export default IsOnboarding(AddBrandPage);
