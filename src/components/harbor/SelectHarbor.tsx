import { Box, Input, SimpleGrid, Field } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldHarborSelect from './InputFieldHarborSelect';
import { HarborType } from '../../types/harbor';

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
          placeholder={'Seleccione el Puerto'}
          setHarbor={setHarbor}
          type={type}
        />
        <Box>
          <Field.Label>Tipo</Field.Label>
          <Input readOnly={true} value={harbor?.type || ''} placeholder='Tipo de Puerto' />
        </Box>
        <Box>
          <Field.Label>Dirección</Field.Label>
          <Input
            readOnly={true}
            value={harbor?.address || ''}
            placeholder='Tipo de Dirección del puerto'
          />
        </Box>
        <Box>
          <Field.Label>Locación</Field.Label>
          <Input readOnly={true} value={harbor?.location || ''} />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default SelectHarbor;
