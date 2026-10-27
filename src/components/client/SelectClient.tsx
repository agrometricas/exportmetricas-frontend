import { Box, Input, SimpleGrid, Field } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldClientSelect from './InputFieldClientSelect';
import { ClientType } from '../../types/client';

interface SelectClientProps {
  name: string;
  harbor?: number;
  isHarbor?: boolean;
  clientSelect?: Partial<ClientType>;
  setClientSelect?: (client: Partial<ClientType> | null) => void;
}

const SelectClient: React.FC<SelectClientProps> = ({
  name,
  harbor,
  isHarbor,
  clientSelect,
  setClientSelect,
}) => {
  const [client, setClient] = useState<Partial<ClientType> | null>(null);

  useEffect(() => {
    if (!!clientSelect) {
      setClient(clientSelect);
    }
  }, [clientSelect]);

  useEffect(() => {
    if (!!setClientSelect) {
      setClientSelect(client);
    }
  }, [client, setClientSelect]);

  return (
    <>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
        <InputFieldClientSelect
          name={name}
          label={'Cliente'}
          placeholder={'Seleccione el Cliente'}
          setClient={setClient}
          harbor={harbor}
          isHarbor={isHarbor}
        />

        <Box>
          <Field.Label fontSize='sm'>RUC</Field.Label>
          <Input
            readOnly={true}
            value={client?.businessId || ''}
            placeholder='Ruc del Cliente'
          />
        </Box>
        <Box>
          <Field.Label fontSize='sm'>Tipo</Field.Label>
          <Input
            readOnly={true}
            value={client?.type || ''}
            placeholder='Tipo'
          />
        </Box>
        <Box>
          <Field.Label fontSize='sm'>Correo</Field.Label>
          <Input
            readOnly={true}
            value={client?.email || ''}
            placeholder='Correo del Cliente'
          />
        </Box>
        <Box>
          <Field.Label fontSize='sm'>Teléfono</Field.Label>
          <Input
            readOnly={true}
            value={client?.phone || ''}
            placeholder='Teléfono del Cliente'
          />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default SelectClient;
