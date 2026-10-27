import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldProducerSelect from './InputFieldProducerSelect';
import { MerchantResponse } from '../../types/merchant/merchant.response';
import { FormLabel } from '../ui/form/FormLabel';

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
          placeholder="Selecciona el productor"
          setProducer={setProducer}
        />
        <Box>
          <FormLabel fontSize='sm'>RUC</FormLabel>
          <Input
            readOnly
            value={producer?.businessId || ''}
            placeholder="RUC del Productor"
          />
        </Box>
        <Box>
          <FormLabel fontSize='sm'>Dirección</FormLabel>
          <Input
            readOnly
            value={producer?.address || ''}
            placeholder="Dirección del Productor"
          />
        </Box>
        {producer?.city?.name &&
          <Box>
            <FormLabel fontSize='sm'>Ciudad</FormLabel>
            <Input
              readOnly
              value={producer?.city?.name || ''}
              placeholder="Ciudad del Productor"
            />
          </Box>}
        {!producer?.city?.name && (
          <Box>
            <FormLabel fontSize='sm'>Tipo de Contrato</FormLabel>
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
