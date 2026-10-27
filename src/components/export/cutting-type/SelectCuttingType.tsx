import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldCuttingTypeSelect from './InputFieldCuttingTypeSelect';
import { CuttingType } from '../../../types/cuttingType';
import { FormLabel } from '../../ui/form/FormLabel';

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
          label={'Tipo de corte'}
          placeholder={'Selecciona el tipo de corte'}
          setCuttingType={setCuttingType}
        />
        <Box>
          <FormLabel fontSize='sm'>Calidad</FormLabel>
          <Input
            readOnly={true}
            value={cuttingType?.quality || ''}
            placeholder='Calidad del corte'
          />
        </Box>
        <Box>
          <FormLabel fontSize='sm'>Detalle del cluster</FormLabel>
          <Input
            readOnly={true}
            value={cuttingType?.clusterDetail || ''}
            placeholder='Detalle del cluster'
          />
        </Box>
        <Box>
          <FormLabel fontSize='sm'>Patrón de empaque</FormLabel>
          <Input
            readOnly={true}
            value={cuttingType?.packagingPattern || ''}
            placeholder='Patrón de empaque'
          />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default SelectCuttingType;
