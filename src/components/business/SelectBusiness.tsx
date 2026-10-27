import { Box, Input, SimpleGrid, Field } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldBusinessSelect from './InputFieldBusinessSelect';
import { BusinessType } from '../../types/merchant/business';

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
          <Field.Label fontSize='sm'>Área</Field.Label>
          <Input
            readOnly={true}
            value={business?.area || ''}
            placeholder='Área de la Finca'
          />
        </Box>
        <Box>
          <Field.Label fontSize='sm'>Dirección</Field.Label>
          <Input
            readOnly={true}
            value={business?.address || ''}
            placeholder='Dirección de la Finca'
          />
        </Box>
        <Box>
          <Field.Label fontSize='sm'>Ciudad</Field.Label>
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
