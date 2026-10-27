'use client';
import { Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdContentCut } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import AddCuttingTypeForm from '../../../../../components/export/cutting-type/AddCuttingTypeForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useCuttingType } from '../../../../../hooks/export/cutting-type/getCuttingType';
import { CuttingType } from '../../../../../types/cuttingType';

function EditCuttingTypePage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCuttingType(id);
  const cuttingType = data as CuttingType | undefined;

  return (
    <CardPage
      icon={MdContentCut}
      title='Editar tipo de corte'
      description='Las hojas ya generadas no cambian; la próxima corrección de una hoja usa estos datos'
    >
      {isLoading ? (
        <LoadingState />
      ) : cuttingType ? (
        <AddCuttingTypeForm cuttingType={cuttingType} />
      ) : (
        <Text>No se encontró el tipo de corte Nº {id}.</Text>
      )}
    </CardPage>
  );
}

export default IsOnboarding(EditCuttingTypePage);
