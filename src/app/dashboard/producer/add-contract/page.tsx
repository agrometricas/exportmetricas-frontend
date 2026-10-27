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
      description='Registra el cupo semanal aprobado de una finca'
    >
      <ProducerContractForm />
    </CardPage>
  );
}

export default IsOnboarding(AddProducerContractPage);
