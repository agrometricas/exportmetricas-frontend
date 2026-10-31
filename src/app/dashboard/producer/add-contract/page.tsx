'use client';
import React from 'react';
import { MdOutlineAssignment } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import ProducerContractForm from '../../../../components/producer-contract/ProducerContractForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddProducerContractPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineAssignment}
      title='Agregar contrato de productor'
      description='Lo que se le compra a una finca cada semana, a qué precio, y su cupo del MAGAP'
    >
      <ProducerContractForm />
    </CardPage>
  );
}

export default IsOnboarding(AddProducerContractPage);
