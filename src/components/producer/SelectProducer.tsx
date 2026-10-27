import { Box, Input, SimpleGrid, Field } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldProducerSelect from './InputFieldProducerSelect';
import { MerchantResponse } from '../../types/merchant/merchant.response';

interface SelectProducerProps {
  name: string;
  producerSelect?: Partial<MerchantResponse>;
  setProducerSelect?: (producer: Partial<MerchantResponse> | null) => void;
}

const SelectProducer: React.FC<SelectProducerProps> = ({
  name,
  producerSelect,
  setProducerSelect,
}) => {
  const [producer, setProducer] = useState<Partial<MerchantResponse> | null>(null);

  useEffect(() => {
    if (!!producerSelect) {
      setProducer(producerSelect);
    }
  }, [producerSelect]);

  useEffect(() => {
    if (!!setProducerSelect) {
      setProducerSelect(producer);
    }
  }, [producer, setProducerSelect]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <InputFieldProducerSelect
          name={name}
          label="Productor/Razón Social"
          placeholder="Seleccione el productor"
          setProducer={setProducer}
        />
        <Box>
          <Field.Label fontSize='sm'>RUC</Field.Label>
          <Input
            readOnly
            value={producer?.businessId || ''}
            placeholder="RUC del Productor"
          />
        </Box>
        <Box>
          <Field.Label fontSize='sm'>Dirección</Field.Label>
          <Input
            readOnly
            value={producer?.address || ''}
            placeholder="Dirección del Productor"
          />
        </Box>
        {producer?.city?.name &&
          <Box>
            <Field.Label fontSize='sm'>Ciudad</Field.Label>
            <Input
              readOnly
              value={producer?.city?.name || ''}
              placeholder="Ciudad del Productor"
            />
          </Box>}
        {!producer?.city?.name && (
          <Box>
            <Field.Label fontSize='sm'>Tipo de Contrato</Field.Label>
            <Input
              readOnly
              value={producer?.contractType || 'No disponible'}
              placeholder="Contrato del Productor"
            />
          </Box>
        )}
      </SimpleGrid>
    </>
  );
};

export default SelectProducer;
