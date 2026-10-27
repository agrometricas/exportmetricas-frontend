import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import TableBoxBrandDetail, { BoxBrandDetailRow } from './TableBoxBrandDetail';
import { useMaterialUnits } from '../../../hooks/settings/materialUnits';
import { BoxBrandType } from '../../../types/box-brand/boxBrand';
import { MaterialUnitsResponse } from '../../../types/materialUnits';
import { MATERIAL_TYPE_LABELS } from '../../../utils/materialTypeLabels';
import { QUANTITY_FIELDS, quantityUnit } from '../../../utils/materialUnits';

const DetailBoxBrand = ({
  detail,
}: {
  detail: Partial<BoxBrandType>;
}): React.JSX.Element => {
  const { data: unitsConfig } = useMaterialUnits();
  const unitOf = (type: string): string | undefined =>
    (unitsConfig as MaterialUnitsResponse | undefined)?.materials.find(
      (material) => material.materialType === type
    )?.unit;

  const convertObjectToArray = (
    inputObject: Partial<BoxBrandType>
  ): BoxBrandDetailRow[] => {
    const outputArray: BoxBrandDetailRow[] = [];

    (Object.keys(inputObject) as (keyof BoxBrandType)[]).forEach((key) => {
      const quantityKey = `${key}Quantity` as keyof BoxBrandType;
      const value = inputObject[key];

      if (
        key !== 'brand' &&
        !key.toString().endsWith('Quantity') &&
        quantityKey in inputObject
      ) {
        if (typeof value === 'object' && value !== null) {
          const field = QUANTITY_FIELDS[quantityKey];
          const material = value as BoxBrandDetailRow['object'] & object;
          outputArray.push({
            name: field
              ? `${MATERIAL_TYPE_LABELS[field.type] ?? field.type}: ${material.name}`
              : (material.name ?? ''),
            quantity: field
              ? `${inputObject[quantityKey]} ${quantityUnit(unitOf(field.type), field.base)}`
              : String(inputObject[quantityKey] ?? ''),
            object: material,
          });
        } else if (value !== null && value !== 'N/A') {
          outputArray.push({
            name: String(value ?? ''),
            quantity: String(inputObject[quantityKey] ?? ''),
          });
        }
      } else if (key !== 'brand' && Array.isArray(value)) {
        const items = value as Record<string, unknown>[];
        const array = value as BoxBrandDetailRow['array'];
        const listOf = (name: string): void => {
          outputArray.push({ name, quantity: String(items.length), array });
        };

        if (
          items.every(
            (item) => item.id !== undefined && item.name !== undefined
          )
        ) {
          listOf('Certificados');
        }
        if (
          items.every(
            (item) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.pesticide !== undefined
          )
        ) {
          listOf('Cóctel de pesticidas');
        }
        if (
          items.every(
            (item) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.insecticide !== undefined
          )
        ) {
          listOf('Cóctel de insecticidas');
        }
        if (
          items.every(
            (item) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.sticker !== undefined
          )
        ) {
          listOf('Pegatinas');
        }
        if (
          items.every(
            (item) =>
              item.id !== undefined &&
              item.quantity !== undefined &&
              item.sheet !== undefined
          )
        ) {
          listOf('Hojas');
        }
      }
    });

    return outputArray;
  };

  const outputArray = convertObjectToArray(detail);

  return (
    <Box p={'16px'}>
      <VStack gap={4} alignItems={'start'} width={'100%'}>
        <TableBoxBrandDetail details={outputArray} />
      </VStack>
    </Box>
  );
};

export default DetailBoxBrand;
