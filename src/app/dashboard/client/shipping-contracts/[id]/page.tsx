'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdDirectionsBoat } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import ShippingContractForm from '../../../../../components/shipping-contract/ShippingContractForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useShippingContract } from '../../../../../hooks/shipping-contract/getShippingContract';
import { ShippingContractResponse } from '../../../../../types/shippingContract';

function EditShippingContractPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: contract, isLoading } = useShippingContract(id);

  return (
    <CardPage
      icon={MdDirectionsBoat}
      title='Editar Contrato Naviero'
      description='Cambia las rutas, los costos o la vigencia del contrato'
    >
      {isLoading || !contract ? (
        <LoadingState />
      ) : (
        <ShippingContractForm contract={contract as ShippingContractResponse} />
      )}
    </CardPage>
  );
}

export default IsOnboarding(EditShippingContractPage);
