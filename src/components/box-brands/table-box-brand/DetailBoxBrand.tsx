/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import TableBoxBrandDetail from './TableBoxBrandDetail';
import { useMaterialUnits } from '../../../hooks/settings/materialUnits';
import { InsecticideCocktailPart } from '../../../types/box-brand/additions/insecticideCocktailPart';
import { SheetCocktail } from '../../../types/box-brand/additions/sheet';
import { StickerCocktail } from '../../../types/box-brand/additions/sticker';
import { BoxBrandType } from '../../../types/box-brand/boxBrand';
import { PesticideCocktailPart } from '../../../types/box-brand/post-harvest/pesticideCocktailPart';
import { RequiredCertificateType } from '../../../types/box-brand/specifications/requiredCertificate';
import { MaterialUnitsResponse } from '../../../types/materialUnits';
import { MATERIAL_TYPE_LABELS } from '../../../utils/materialTypeLabels';
import { QUANTITY_FIELDS, quantityUnit } from '../../../utils/materialUnits';

const DetailBoxBrand = ({
  detail,
  width,
  windowSize,
}: {
  detail: Partial<BoxBrandType>;
  width: { sm: number; md: number };
  windowSize: { width: number | null; height: number | null };
}): React.JSX.Element => {
  const { data: unitsConfig } = useMaterialUnits();
  const unitOf = (type: string): string | undefined =>
    (unitsConfig as MaterialUnitsResponse | undefined)?.materials.find(
      (material) => material.materialType === type
    )?.unit;

  const convertObjectToArray = (inputObject: Partial<BoxBrandType>): any[] => {
    const outputArray: any[] = [];

    (Object.keys(inputObject) as (keyof BoxBrandType)[]).forEach((key) => {
      const quantityKey = `${key}Quantity` as keyof BoxBrandType;

      if (
        key !== 'brand' &&
        !key.toString().endsWith('Quantity') &&
        quantityKey in inputObject
      ) {
        if (typeof inputObject[key] === 'object' && inputObject[key] !== null) {
          const field = QUANTITY_FIELDS[quantityKey];
          outputArray.push({
            ['name']: field
              ? `${MATERIAL_TYPE_LABELS[field.type] ?? field.type}: ${(inputObject[key] as any).name}`
              : (inputObject[key] as any).name,
            ['quantity']: field
              ? `${inputObject[quantityKey]} ${quantityUnit(unitOf(field.type), field.base)}`
              : inputObject[quantityKey],
            ['object']: inputObject[key],
          });
        } else if (inputObject[key] !== null && inputObject[key] !== 'N/A') {
          outputArray.push({
            ['name']: inputObject[key],
            ['quantity']: inputObject[quantityKey],
          });
        }
      } else if (
        key !== 'brand' &&
        typeof inputObject[key] === 'object' &&
        Array.isArray(inputObject[key])
      ) {
        const arrayValue:
          | RequiredCertificateType[]
          | PesticideCocktailPart[]
          | InsecticideCocktailPart[]
          | StickerCocktail[]
          | SheetCocktail[]
          | any[]
          | any = inputObject[key];

        if (
          Array.isArray(inputObject[key]) &&
          arrayValue.every(
            (item: RequiredCertificateType) =>
              item.id !== undefined && item.name !== undefined
          )
        ) {
          outputArray.push({
            ['name']: 'Certificados',
            ['quantity']: inputObject[key].length,
            ['array']: inputObject[key],
          });
        }

        if (
          Array.isArray(inputObject[key]) &&
          arrayValue.every(
            (item: PesticideCocktailPart) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.pesticide !== undefined
          )
        ) {
          outputArray.push({
            ['name']: 'Cóctel de Pesticidas',
            ['quantity']: inputObject[key].length,
            ['array']: inputObject[key],
          });
        }

        if (
          Array.isArray(inputObject[key]) &&
          arrayValue.every(
            (item: InsecticideCocktailPart) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.insecticide !== undefined
          )
        ) {
          outputArray.push({
            ['name']: 'Cóctel de Insecticidas',
            ['quantity']: inputObject[key].length,
            ['array']: inputObject[key],
          });
        }

        if (
          Array.isArray(inputObject[key]) &&
          arrayValue.every(
            (item: StickerCocktail) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.sticker !== undefined
          )
        ) {
          outputArray.push({
            ['name']: 'Pegatinas',
            ['quantity']: inputObject[key].length,
            ['array']: inputObject[key],
          });
        }

        if (
          Array.isArray(inputObject[key]) &&
          arrayValue.every(
            (item: SheetCocktail) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.sheet !== undefined
          )
        ) {
          outputArray.push({
            ['name']: 'Hojas',
            ['quantity']: inputObject[key].length,
            ['array']: inputObject[key],
          });
        }
      }
    });

    return outputArray;
  };

  const outputArray = convertObjectToArray(detail);

  return (
    <Box p={'16px'} width={{ sm: `${width.sm}px`, md: `${width.md}px` }}>
      <VStack gap={4} pl={'60px'} alignItems={'start'} width={'100%'}>
        <TableBoxBrandDetail
          details={outputArray}
          width={width}
          windowSize={windowSize}
        />
      </VStack>
    </Box>
  );
};

export default DetailBoxBrand;
