import { Accordion, Box, Text } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
} from '@/components/ui/DetailFields';
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
            <Box flex='1' textAlign='left' fontWeight='bold'>
              Detalles generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </h2>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre'>{verifier.name}</DetailField>
              <DetailField label='RUC'>{verifier.ruc}</DetailField>
              <DetailField label='Dirección'>{verifier.address}</DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <h2>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontWeight='bold'>
              Contactos asociados
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </h2>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            {verifier.contacts.length ? (
              verifier.contacts.map((contact) => (
                <DetailItem key={contact.id}>
                  <DetailFields>
                    <DetailField label='Nombre'>{contact.name}</DetailField>
                    <DetailField label='Email'>{contact.email}</DetailField>
                    <DetailField label='Teléfono'>{contact.phone}</DetailField>
                  </DetailFields>
                </DetailItem>
              ))
            ) : (
              <Text>No hay contactos registrados.</Text>
            )}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailVerifiers;
