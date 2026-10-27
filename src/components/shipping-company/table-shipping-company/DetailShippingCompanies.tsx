import { Accordion, Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { ShippingCompanyResponse } from '../../../types/shippingCompany.response';

const DetailShippingCompanies = ({
  company,
}: {
  company: ShippingCompanyResponse;
}): React.JSX.Element => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles Generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Text>
              <strong>Nombre:</strong> {company.name}
            </Text>
            <Text>
              <strong>Código:</strong> {company.code}
            </Text>
            <Text>
              <strong>Frecuencia:</strong> {company.frequencies}
            </Text>
            <Text>
              <strong>Tipo de Carga:</strong> {company.cargoType}
            </Text>
            <Text>
              <strong>País:</strong> {company.country.name}
            </Text>
            <Text>
              <strong>Plataforma de Tracking:</strong>{' '}
              {company.trackingPlatform || 'No disponible'}
            </Text>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Puertos Asociados
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            {company.harbors.map((harbor, index) => (
              <Box key={index} mt={3} borderBottomWidth='1px' pb={2}>
                <Text>
                  <strong>Puerto de Salida:</strong>{' '}
                  {harbor.harborDeparture.name}
                </Text>
                <Text>
                  <strong>Puerto de Llegada:</strong>{' '}
                  {harbor.harborDestination.name}
                </Text>
                <Text>
                  <strong>Duración Estimada:</strong> {harbor.estDuration}
                </Text>
              </Box>
            ))}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

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
            {company.contacts.map((contact, index) => (
              <Box key={index} mt={3}>
                <Text>
                  <strong>Nombre:</strong> {contact.name}
                </Text>
                <Text>
                  <strong>Rol:</strong> {contact.role || 'No especificado'}
                </Text>
                <Text>
                  <strong>Email:</strong> {contact.email}
                </Text>
                <Text>
                  <strong>Teléfono:</strong> {contact.phone}
                </Text>
              </Box>
            ))}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailShippingCompanies;
