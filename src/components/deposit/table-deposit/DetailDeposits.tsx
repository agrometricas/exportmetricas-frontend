import { Accordion, Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { DepositResponse } from '../../../types/deposit/deposit.response';

interface DetailDepositsProps {
  deposit: DepositResponse;
}

const DetailDeposits: React.FC<DetailDepositsProps> = ({ deposit }) => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles del Depósito
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}><Accordion.ItemBody>
            <Text><strong>Nombre:</strong> {deposit.name}</Text>
            <Text><strong>Código:</strong> {deposit.code}</Text>
            <Text><strong>Dirección:</strong> {deposit.address}</Text>
            <Text><strong>Ciudad:</strong> {deposit.city.name}</Text>
            <Text><strong>Hora de Apertura:</strong> {deposit.openTime}</Text>
            <Text><strong>Hora de Cierre:</strong> {deposit.closeTime}</Text>
            {deposit.latitude && deposit.longitude && (
              <Text><strong>Latitud / Longitud:</strong> {deposit.latitude}, {deposit.longitude}</Text>
            )}
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>

      {deposit.contacts.length > 0 && (
        <Accordion.Item value='item-1'>
          <Heading>
            <Accordion.ItemTrigger>
              <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
                Contactos
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}><Accordion.ItemBody>
              {deposit.contacts.map((contact, index) => (
                <Box key={index} mb={4}>
                  <Text><strong>Nombre:</strong> {contact.name}</Text>
                  {contact.role && <Text><strong>Rol:</strong> {contact.role}</Text>}
                  <Text><strong>Email:</strong> {contact.email}</Text>
                  <Text><strong>Teléfono:</strong> {contact.phone}</Text>
                </Box>
              ))}
            </Accordion.ItemBody></Accordion.ItemContent>
        </Accordion.Item>
      )}
    </Accordion.Root>
  );
};

export default DetailDeposits;
