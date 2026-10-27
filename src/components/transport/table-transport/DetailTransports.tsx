import { Accordion, Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { TransportResponse } from '../../../types/transport/transport.response';

interface DetailTransportsProps {
  transport: TransportResponse;
}

const DetailTransports: React.FC<DetailTransportsProps> = ({ transport }) => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger
          >
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Detalles Generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}><Accordion.ItemBody>
            <Text><strong>Nombre:</strong> {transport.name}</Text>
            <Text><strong>RUC:</strong> {transport.ruc}</Text>
            <Text><strong>Dirección:</strong> {transport.address}</Text>
            <Text><strong>Rastreo Satelital:</strong> {transport.satelliteTracking ? 'Sí' : 'No'}</Text>
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>

      {transport.transportCertifications.length > 0 && (
        <Accordion.Item value='item-1'>
          <Heading>
            <Accordion.ItemTrigger
            >
              <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
                Certificaciones
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}><Accordion.ItemBody>
              {transport.transportCertifications.map((cert, i) => (
                <Text key={i}>• {cert.certification.name}</Text>
              ))}
            </Accordion.ItemBody></Accordion.ItemContent>
        </Accordion.Item>
      )}

      {transport.contacts.length > 0 && (
        <Accordion.Item value='item-2'>
          <Heading>
            <Accordion.ItemTrigger
            >
              <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
                Contactos
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}><Accordion.ItemBody>
              {transport.contacts.map((contact, i) => (
                <Box key={i} mb={3}>
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

export default DetailTransports;
