import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldBoxBrandSelect from './InputFieldBoxBrandSelect';
import { BoxBrandType } from '../../types/box-brand/boxBrand';
import { FormLabel } from '../ui/form/FormLabel';
import InputFieldNumber from '../ui/form/InputFieldNumber';

interface SelectBoxBrandProps {
  name: string;
  name2?: string;
  boxQuantity?: number;
  boxBrandSelect?: Partial<BoxBrandType>;
  setBoxBrandSelect?: (boxBran: Partial<BoxBrandType> | null) => void;
  children?: React.ReactNode;
}

const SelectBoxBrand: React.FC<SelectBoxBrandProps> = ({
  name,
  name2,
  boxQuantity,
  boxBrandSelect,
  setBoxBrandSelect,
  children,
}) => {
  const [boxBrand, setBoxBrand] = useState<Partial<BoxBrandType> | null>(null);

  useEffect(() => {
    if (!!boxBrandSelect) {
      setBoxBrand(boxBrandSelect);
    }
  }, [boxBrandSelect]);

  useEffect(() => {
    if (!!setBoxBrandSelect) {
      setBoxBrandSelect(boxBrand);
    }
  }, [boxBrand, setBoxBrandSelect]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <InputFieldBoxBrandSelect
          name={name}
          label={'Marca de caja'}
          placeholder={'Selecciona la marca'}
          setBoxBrand={setBoxBrand}
        />

        <Box>
          <FormLabel fontSize='sm'>Código</FormLabel>
          <Input readOnly={true} value={boxBrand?.brandCode || ''} />
        </Box>

        {!!name2 && (
          <InputFieldNumber
            name={name2}
            label={'Número de cajas'}
            value={boxQuantity || ''}
          />
        )}

        {children}
      </SimpleGrid>
    </>
  );
};

export default SelectBoxBrand;
