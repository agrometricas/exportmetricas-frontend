'use client';
import React from 'react';
import { MdDirectionsBoat } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import AddShippingCompanyForm from '../../../../components/shipping-company/AddShippingCompanyForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddShippingCompanyPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdDirectionsBoat}
      title='Agregar Nueva Naviera'
      description='Completa el formulario para registrar una naviera'
    >
      <AddShippingCompanyForm />
    </CardPage>
  );
}

export default IsOnboarding(AddShippingCompanyPage);
