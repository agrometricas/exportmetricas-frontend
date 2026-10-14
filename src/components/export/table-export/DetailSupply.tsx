/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import TableSupply from './TableSupply';
import { BoxBrandType } from '../../../types/box-brand/boxBrand';
import {
  ExportSentType,
  InsecticideSentPartType,
  PesticideSentPartType,
} from '../../../types/exportSent';

interface props {
  boxBrand: Partial<BoxBrandType>;
  supply: Partial<ExportSentType>;
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
  pendingSent: boolean;
}

const DetailSupply = ({
  boxBrand,
  supply,
  width,
  windowSize,
  pendingSent,
}: props): React.JSX.Element | undefined => {
  const convertToArray = ({
    supplyObject,
    boxBrandObject,
  }: {
    boxBrandObject: Partial<BoxBrandType>;
    supplyObject: Partial<ExportSentType>;
  }): any[] => {
    const outputArray: any[] = [];

    (Object.keys(supplyObject) as (keyof ExportSentType)[]).forEach((key) => {
      const material = key.replace(/Quantity$/, '') as keyof BoxBrandType;

      if (key.toString().endsWith('Quantity') && key in boxBrandObject) {
        if (
          typeof boxBrandObject[material] === 'object' &&
          boxBrandObject[material] !== null
        ) {
          outputArray.push({
            ['name']: (boxBrandObject[material] as any).name,
            ['need']: boxBrandObject[key as keyof BoxBrandType],
            ['sent']: supplyObject[key],
          });
        } else if (
          boxBrandObject[material] !== null &&
          boxBrandObject[material] !== 'N/A'
        ) {
          outputArray.push({
            ['name']: boxBrandObject[material],
            ['need']: boxBrandObject[key as keyof BoxBrandType],
            ['sent']: supplyObject[key],
          });
        }
      } else if (
        typeof supplyObject[key] === 'object' &&
        Array.isArray(supplyObject[key]) &&
        (supplyObject[key] as any[]).length > 0
      ) {
        const arrayValue:
          | PesticideSentPartType[]
          | InsecticideSentPartType[]
          | any = supplyObject[key];

        if (
          Array.isArray(supplyObject[key]) &&
          arrayValue.every(
            (item: PesticideSentPartType) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.pesticide !== undefined
          )
        ) {
          outputArray.push({
            ['name']: 'Cóctel de Pesticidas',
            ['quantity']: 1,
            ['arrayNeed']:
              boxBrandObject['pesticideCocktail' as keyof BoxBrandType],
            ['arraySent']: supplyObject[key],
          });
        }

        if (
          Array.isArray(supplyObject[key]) &&
          arrayValue.every(
            (item: InsecticideSentPartType) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.insecticide !== undefined
          )
        ) {
          outputArray.push({
            ['name']: 'Cóctel de Insecticidas',
            ['quantity']: 1,
            ['arrayNeed']:
              boxBrandObject['insecticideCocktail' as keyof BoxBrandType],
            ['arraySent']: supplyObject[key],
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
    <Box p={'16px'} width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
      <VStack spacing={4} pl={'20px'} alignItems={'start'} width={'100%'}>
        <TableSupply details={list} width={width} windowSize={windowSize} />
      </VStack>
    </Box>
  );
};

export default DetailSupply;
