import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldBusinessSelect from './InputFieldBusinessSelect';
import { BusinessType } from '../../types/merchant/business';
import { FormLabel } from '../ui/form/FormLabel';

interface SelectBusinessProps {
  name: string;
  merchant?: number;
  businessSelect?: Partial<BusinessType>;
}

const SelectBusiness: React.FC<SelectBusinessProps> = ({
  name,
  merchant,
  businessSelect,
}) => {
  const [business, setBusiness] = useState<Partial<BusinessType> | null>(null);

  useEffect(() => {
    if (!!businessSelect) {
      setBusiness(businessSelect);
    }
  }, [businessSelect]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <InputFieldBusinessSelect
          name={name}
          label={'Finca/Razón Social'}
          placeholder={'Seleccione la Finca'}
          setBusiness={setBusiness}
          merchant={merchant}
        />

        <Box>
          <FormLabel fontSize='sm'>Área</FormLabel>
          <Input
            readOnly={true}
            value={business?.area || ''}
            placeholder='Área de la Finca'
          />
        </Box>
        <Box>
          <FormLabel fontSize='sm'>Dirección</FormLabel>
          <Input
            readOnly={true}
            value={business?.address || ''}
            placeholder='Dirección de la Finca'
          />
        </Box>
        <Box>
          <FormLabel fontSize='sm'>Ciudad</FormLabel>
          <Input
            readOnly={true}
            value={business?.city?.name || ''}
            placeholder='Ciudad de la Finca'
          />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default SelectBusiness;
