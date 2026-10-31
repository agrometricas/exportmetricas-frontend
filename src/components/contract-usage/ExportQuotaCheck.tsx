import { Alert, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useContractUsageCheck } from '../../hooks/contract-usage/contractUsage';
import {
  ContractUsageCheckParams,
  PurchaseTerms,
} from '../../types/contractUsage';

function PurchaseNote({
  purchase,
}: {
  purchase: PurchaseTerms;
}): React.JSX.Element {
  if (purchase.contractType === 'SPOT') {
    return (
      <Alert.Root status='info' borderRadius='md'>
        <Alert.Indicator />
        <Alert.Description fontSize='sm'>
          {purchase.note} El precio se pone en la hoja semanal de precios.
        </Alert.Description>
      </Alert.Root>
    );
  }
  const contract = purchase.contract;
  return (
    <Alert.Root status='success' borderRadius='md'>
      <Alert.Indicator />
      <Alert.Description fontSize='sm'>
        Va de contrato ({purchase.contractType}) a ${purchase.producerPrice} por
        caja.
        {contract?.weeklyContainers
          ? ` La finca ya usó ${contract.usedContainers} de sus ${contract.weeklyContainers} contenedores de la semana; esta ocupa ${purchase.containers}.`
          : ''}
      </Alert.Description>
    </Alert.Root>
  );
}

// It only informs: the export is saved whatever the farm's week looks like.
export default function ExportQuotaCheck({
  params,
}: {
  params: ContractUsageCheckParams | null;
}): React.JSX.Element | null {
  const check = useContractUsageCheck(params);
  if (!check) return null;

  return (
    <Flex direction='column' gap={2}>
      {check.purchase && <PurchaseNote purchase={check.purchase} />}
      {check.warning ? (
        <Alert.Root status='warning' borderRadius='md'>
          <Alert.Indicator />
          <Alert.Description fontSize='sm'>{check.warning}</Alert.Description>
        </Alert.Root>
      ) : (
        check.approvedWeeklyBoxes !== null && (
          <Text fontSize='sm' color='fg.muted'>
            Cupo MAGAP de {check.business.name} esa semana:{' '}
            {check.approvedWeeklyBoxes} cajas; con esta exportación lleva{' '}
            {check.exportedBoxes}.
          </Text>
        )
      )}
    </Flex>
  );
}
