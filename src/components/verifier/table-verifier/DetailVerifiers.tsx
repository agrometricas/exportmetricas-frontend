import { Accordion, Box, Text } from '@chakra-ui/react';
import React from 'react';
import { VerifierResponse } from '../../../types/verifier/verifier.response';

interface DetailVerifiersProps {
  verifier: VerifierResponse;
}

const DetailVerifiers: React.FC<DetailVerifiersProps> = ({ verifier }) => {
  return (
    <Accordion.Root multiple defaultValue={['item-0']}>
      <Accordion.Item value='item-0'>
        <h2>
          <Accordion.ItemTrigger>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Detalles Generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </h2>
        <Accordion.ItemContent pb={4}><Accordion.ItemBody>
            <Text><strong>Nombre:</strong> {verifier.name}</Text>
            <Text><strong>RUC:</strong> {verifier.ruc}</Text>
            <Text><strong>Dirección:</strong> {verifier.address}</Text>
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <h2>
          <Accordion.ItemTrigger>
            <Box flex="1" textAlign="left" fontWeight="bold">
              Contactos Asociados
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </h2>
        <Accordion.ItemContent pb={4}><Accordion.ItemBody>
            {verifier.contacts.length ? (
              verifier.contacts.map((contact) => (
                <Box key={contact.id} mb={3}>
                  <Text><strong>Nombre:</strong> {contact.name}</Text>
                  <Text><strong>Email:</strong> {contact.email}</Text>
                  <Text><strong>Teléfono:</strong> {contact.phone}</Text>
                </Box>
              ))
            ) : (
              <Text>No hay contactos registrados.</Text>
            )}
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailVerifiers;
