import { Box, Input, SimpleGrid, Field } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldCuttingTypeSelect from './InputFieldCuttingTypeSelect';
import { CuttingType } from '../../../types/cuttingType';

interface SelectCuttingTypeProps {
  name: string;
  cuttingTypeSelect?: Partial<CuttingType>;
  setCuttingTypeSelect?: (cuttingType: Partial<CuttingType> | null) => void;
}

const SelectCuttingType: React.FC<SelectCuttingTypeProps> = ({
  name,
  cuttingTypeSelect,
  setCuttingTypeSelect,
}) => {
  const [cuttingType, setCuttingType] = useState<Partial<CuttingType> | null>(
    null
  );

  useEffect(() => {
    if (!!cuttingTypeSelect) {
      setCuttingType(cuttingTypeSelect);
    }
  }, [cuttingTypeSelect]);

  useEffect(() => {
    if (!!setCuttingTypeSelect) {
      setCuttingTypeSelect(cuttingType);
    }
  }, [cuttingType, setCuttingTypeSelect]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <InputFieldCuttingTypeSelect
          name={name}
          label={'Tipo de Corte'}
          placeholder={'Seleccione el Tipo de Corte'}
          setCuttingType={setCuttingType}
        />
        <Box>
          <Field.Label fontSize='sm'>Calidad</Field.Label>
          <Input readOnly={true} value={cuttingType?.quality || ''} placeholder='Calidad del Corte' />
        </Box>
        <Box>
          <Field.Label fontSize='sm'>Detalle del Cluster</Field.Label>
          <Input readOnly={true} value={cuttingType?.clusterDetail || ''} placeholder='Detalle del Cluster' />
        </Box>
        <Box>
          <Field.Label fontSize='sm'>Patrón de Empaque</Field.Label>
          <Input
            readOnly={true}
            value={cuttingType?.packagingPattern || ''}
            placeholder='Patrón de Empaque'
          />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default SelectCuttingType;
