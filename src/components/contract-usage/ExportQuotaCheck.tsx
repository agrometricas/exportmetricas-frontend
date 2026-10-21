import { Alert, AlertDescription, AlertIcon, Text } from '@chakra-ui/react';
import React from 'react';
import { useContractUsageCheck } from '../../hooks/contract-usage/contractUsage';
import { ContractUsageCheckParams } from '../../types/contractUsage';

// It only warns: the export is saved whatever the farm's week looks like.
export default function ExportQuotaCheck({
  params,
}: {
  params: ContractUsageCheckParams | null;
}): React.JSX.Element | null {
  const check = useContractUsageCheck(params);
  if (!check) return null;

  if (check.warning) {
    return (
      <Alert status='warning' borderRadius='md'>
        <AlertIcon />
        <AlertDescription fontSize='sm'>{check.warning}</AlertDescription>
      </Alert>
    );
  }
  return (
    <Text fontSize='sm' color='gray.600'>
      {check.approvedWeeklyBoxes === null
        ? `${check.business.name} no tiene contrato vigente esa semana.`
        : `Cupo de ${check.business.name} esa semana: ${check.approvedWeeklyBoxes} cajas; con esta exportación lleva ${check.exportedBoxes}.`}
    </Text>
  );
}
