import { Accordion, Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
} from '@/components/ui/DetailFields';
import { TransportResponse } from '../../../types/transport/transport.response';

interface DetailTransportsProps {
  transport: TransportResponse;
}

const DetailTransports: React.FC<DetailTransportsProps> = ({ transport }) => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre'>{transport.name}</DetailField>
              <DetailField label='RUC'>{transport.ruc}</DetailField>
              <DetailField label='Dirección'>{transport.address}</DetailField>
              <DetailField label='Rastreo satelital'>
                {transport.satelliteTracking ? 'Sí' : 'No'}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      {transport.transportCertifications.length > 0 && (
        <Accordion.Item value='item-1'>
          <Heading>
            <Accordion.ItemTrigger>
              <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
                Certificaciones
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}>
            <Accordion.ItemBody>
              {transport.transportCertifications.map((cert, i) => (
                <Text key={i}>• {cert.certification.name}</Text>
              ))}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      )}

      {transport.contacts.length > 0 && (
        <Accordion.Item value='item-2'>
          <Heading>
            <Accordion.ItemTrigger>
              <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
                Contactos
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}>
            <Accordion.ItemBody>
              {transport.contacts.map((contact, i) => (
                <DetailItem key={i}>
                  <DetailFields>
                    <DetailField label='Nombre'>{contact.name}</DetailField>
                    {contact.role && (
                      <DetailField label='Rol'>{contact.role}</DetailField>
                    )}
                    <DetailField label='Email'>{contact.email}</DetailField>
                    <DetailField label='Teléfono'>{contact.phone}</DetailField>
                  </DetailFields>
                </DetailItem>
              ))}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      )}
    </Accordion.Root>
  );
};

export default DetailTransports;
