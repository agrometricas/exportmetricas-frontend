import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import TableSupply, { SupplyRow } from './TableSupply';
import { BoxBrandType } from '../../../types/box-brand/boxBrand';
import { ExportSentType } from '../../../types/exportSent';

interface props {
  boxBrand: Partial<BoxBrandType>;
  supply: Partial<ExportSentType>;
  pendingSent: boolean;
}

const DetailSupply = ({
  boxBrand,
  supply,
  pendingSent,
}: props): React.JSX.Element | undefined => {
  const convertToArray = ({
    supplyObject,
    boxBrandObject,
  }: {
    boxBrandObject: Partial<BoxBrandType>;
    supplyObject: Partial<ExportSentType>;
  }): SupplyRow[] => {
    const outputArray: SupplyRow[] = [];

    (Object.keys(supplyObject) as (keyof ExportSentType)[]).forEach((key) => {
      const material = key.replace(/Quantity$/, '') as keyof BoxBrandType;
      const value = boxBrandObject[material];
      const sent = supplyObject[key];

      if (key.toString().endsWith('Quantity') && key in boxBrandObject) {
        const need = boxBrandObject[key as keyof BoxBrandType];
        if (typeof value === 'object' && value !== null) {
          outputArray.push({
            name: (value as { name?: string }).name,
            need,
            sent,
          });
        } else if (value !== null && value !== 'N/A') {
          outputArray.push({ name: value, need, sent });
        }
      } else if (Array.isArray(sent) && sent.length > 0) {
        const items = sent as Record<string, unknown>[];
        const arraySent = sent as SupplyRow['arraySent'];

        if (
          items.every(
            (item) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.pesticide !== undefined
          )
        ) {
          outputArray.push({
            name: 'Cóctel de pesticidas',
            arrayNeed:
              boxBrandObject.pesticideCocktail as SupplyRow['arrayNeed'],
            arraySent,
          });
        }

        if (
          items.every(
            (item) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.insecticide !== undefined
          )
        ) {
          outputArray.push({
            name: 'Cóctel de insecticidas',
            arrayNeed:
              boxBrandObject.insecticideCocktail as SupplyRow['arrayNeed'],
            arraySent,
          });
        }
      }
    });

    return outputArray;
  };

  if (pendingSent) return;

  const list = convertToArray({
    supplyObject: supply,
    boxBrandObject: boxBrand,
  });

  return (
    <Box p={'16px'}>
      <VStack gap={4} pl={'20px'} alignItems={'start'} width={'100%'}>
        <TableSupply details={list} />
      </VStack>
    </Box>
  );
};

export default DetailSupply;
