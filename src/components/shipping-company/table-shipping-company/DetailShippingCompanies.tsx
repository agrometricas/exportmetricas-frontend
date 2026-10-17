import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { ShippingCompanyResponse } from '../../../types/shippingCompany.response';

const DetailShippingCompanies = ({
  company,
  width,
}: {
  company: ShippingCompanyResponse;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton
            pl='60px'
            width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles Generales
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pl='60px' pb={4}>
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton
            pl='60px'
            width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Puertos Asociados
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pl='60px' pb={4}>
          {company.harbors.map((harbor, index) => (
            <Box key={index} mt={3} borderBottom='1px solid #e2e8f0' pb={2}>
              <Text>
                <strong>Puerto de Salida:</strong> {harbor.harborDeparture.name}
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
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton
            pl='60px'
            width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Contactos
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pl='60px' pb={4}>
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
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DetailShippingCompanies;
