'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdOutlineAssignment } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import ProducerContractForm from '../../../../../components/producer-contract/ProducerContractForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useProducerContract } from '../../../../../hooks/producer-contract/getProducerContract';
import { ProducerContractResponse } from '../../../../../types/producerContract';

function EditProducerContractPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: contract, isLoading } = useProducerContract(id);

  return (
    <CardPage
      icon={MdOutlineAssignment}
      title='Editar Contrato de Productor'
      description='Cambia el cupo o la vigencia del contrato'
    >
      {isLoading || !contract ? (
        <LoadingState />
      ) : (
        <ProducerContractForm contract={contract as ProducerContractResponse} />
      )}
    </CardPage>
  );
}

export default IsOnboarding(EditProducerContractPage);
