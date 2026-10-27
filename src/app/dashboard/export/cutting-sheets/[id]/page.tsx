'use client';
import { Text } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdContentCut } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import CorrectCuttingSheetForm from '../../../../../components/export/cutting-sheet/CorrectCuttingSheetForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useCuttingSheets } from '../../../../../hooks/export/cuttingSheet/getCuttingSheets';
import { usePagination } from '../../../../../hooks/usePagination';
import { CuttingSheetResponse } from '../../../../../types/cuttingSheet.response';

function CorrectCuttingSheetPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { paginationParams } = usePagination();
  const { data, isLoading } = useCuttingSheets(paginationParams);
  const sheet = ((data ?? []) as CuttingSheetResponse[]).find(
    (row) => row.id === Number(id)
  );

  return (
    <CardPage
      icon={MdContentCut}
      title='Corregir hoja de corte'
      description='Cambia el tipo de corte o el empaque y reenvía la hoja'
    >
      {isLoading ? (
        <LoadingState />
      ) : sheet ? (
        <CorrectCuttingSheetForm sheet={sheet} />
      ) : (
        <Text>No se encontró la hoja de corte Nº {id}.</Text>
      )}
    </CardPage>
  );
}

export default IsOnboarding(CorrectCuttingSheetPage);
