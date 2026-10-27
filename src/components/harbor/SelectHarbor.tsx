import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldHarborSelect from './InputFieldHarborSelect';
import { HarborType } from '../../types/harbor';
import { FormLabel } from '../ui/form/FormLabel';

interface SelectHarborProps {
  name: string;
  harborSelect?: Partial<HarborType>;
  type: 'Nacional' | 'Internacional';
  setHarborSelect?: (harbor: Partial<HarborType> | null) => void;
}

const SelectHarbor: React.FC<SelectHarborProps> = ({
  name,
  harborSelect,
  type,
  setHarborSelect,
}) => {
  const [harbor, setHarbor] = useState<Partial<HarborType> | null>(null);

  useEffect(() => {
    if (!!harborSelect) {
      setHarbor(harborSelect);
    }
  }, [harborSelect]);

  useEffect(() => {
    if (!!setHarborSelect) {
      setHarborSelect(harbor);
    }
  }, [harbor, setHarborSelect]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <InputFieldHarborSelect
          name={name}
          label={'Puerto'}
          placeholder={'Selecciona el puerto'}
          setHarbor={setHarbor}
          type={type}
        />
        <Box>
          <FormLabel>Tipo</FormLabel>
          <Input readOnly={true} value={harbor?.type || ''} placeholder='Tipo de puerto' />
        </Box>
        <Box>
          <FormLabel>Dirección</FormLabel>
          <Input
            readOnly={true}
            value={harbor?.address || ''}
            placeholder='Tipo de dirección del puerto'
          />
        </Box>
        <Box>
          <FormLabel>Locación</FormLabel>
          <Input readOnly={true} value={harbor?.location || ''} />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default SelectHarbor;
