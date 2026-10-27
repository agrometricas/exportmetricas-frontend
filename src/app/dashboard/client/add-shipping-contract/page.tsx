'use client';
import React from 'react';
import { MdDirectionsBoat } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import ShippingContractForm from '../../../../components/shipping-contract/ShippingContractForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddShippingContractPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdDirectionsBoat}
      title='Agregar Contrato Naviero'
      description='Registra las rutas de una naviera con su costo por contenedor y vigencia'
    >
      <ShippingContractForm />
    </CardPage>
  );
}

export default IsOnboarding(AddShippingContractPage);
