import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import InputFieldClientSelect from './InputFieldClientSelect';
import { ClientType } from '../../types/client';
import { FormLabel } from '../ui/form/FormLabel';

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
          placeholder={'Selecciona el cliente'}
          setClient={setClient}
          harbor={harbor}
          isHarbor={isHarbor}
        />

        <Box>
          <FormLabel fontSize='sm'>RUC</FormLabel>
          <Input
            readOnly={true}
            value={client?.businessId || ''}
            placeholder='RUC del cliente'
          />
        </Box>
        <Box>
          <FormLabel fontSize='sm'>Tipo</FormLabel>
          <Input
            readOnly={true}
            value={client?.type || ''}
            placeholder='Tipo'
          />
        </Box>
        <Box>
          <FormLabel fontSize='sm'>Correo</FormLabel>
          <Input
            readOnly={true}
            value={client?.email || ''}
            placeholder='Correo del cliente'
          />
        </Box>
        <Box>
          <FormLabel fontSize='sm'>Teléfono</FormLabel>
          <Input
            readOnly={true}
            value={client?.phone || ''}
            placeholder='Teléfono del cliente'
          />
        </Box>
      </SimpleGrid>
    </>
  );
};

export default SelectClient;
