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
import { HarborResponse } from '../../../types/harbor.response';
interface DetailHarborsProps {
  business: HarborResponse;
  width: { sm: number; md: number };
}

const DetailHarbors: React.FC<DetailHarborsProps> = ({ business, width }) => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton
            pl='60px'
            width={{
              sm: Number(width.sm),
              md: Number(width.md),
            }}
          >
            <Box
              as='span'
              flex='1'
              textAlign='left'
              fontSize='md'
              fontWeight='bold'
            >
              Detalles del Puerto
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
          <Box>
            <Text>
              <strong>Nombre:</strong> {business.name}
            </Text>
            <Text>
              <strong>Código:</strong> {business.code}
            </Text>
            <Text>
              <strong>Dirección:</strong> {business.address}
            </Text>
            <Text>
              <strong>Ubicación:</strong> {business.location}
            </Text>
            <Text>
              <strong>País:</strong> {business.country?.name ?? '—'}
            </Text>
            <Text>
              <strong>Provincia:</strong> {business.province?.name ?? '—'}
            </Text>
            <Text>
              <strong>Ciudad:</strong> {business.city?.name ?? '—'}
            </Text>
            <Text>
              <strong>Tipo:</strong> {business.type}
            </Text>
            {business.latitude && business.longitude && (
              <>
                <Text>
                  <strong>Latitud:</strong> {business.latitude ?? 'N/A'}
                </Text>
                <Text>
                  <strong>Longitud:</strong> {business.longitude ?? 'N/A'}
                </Text>
              </>
            )}
            <Text>
              <strong>Horario de Apertura:</strong> {business.openTime}
            </Text>
            <Text>
              <strong>Horario de Cierre:</strong> {business.closeTime}
            </Text>
            <Text>
              <strong>Días de Operación:</strong>{' '}
              {business.daysOfOperation.join(', ')}
            </Text>
          </Box>
        </AccordionPanel>
      </AccordionItem>
      {business.clients.length > 0 && (
        <AccordionItem>
          <Heading>
            <AccordionButton
              pl='60px'
              width={{
                sm: Number(width.sm),
                md: Number(width.md),
              }}
            >
              <Box
                as='span'
                flex='1'
                textAlign='left'
                fontSize='md'
                fontWeight='bold'
              >
                Clientes
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4} pl='60px'>
            <Box>
              {business.clients.map((client) => (
                <Box key={client.id} mb={4}>
                  <Text>
                    <strong>Nombre:</strong> {client.businessName}
                  </Text>
                  <Text>
                    <strong>RUC:</strong> {client.businessId}
                  </Text>
                  <Text>
                    <strong>Tipo:</strong> {client.type}
                  </Text>
                  <Text>
                    <strong>Correo Electrónico:</strong> {client.email}
                  </Text>
                  <Text>
                    <strong>Teléfono:</strong> {client.phone}
                  </Text>
                </Box>
              ))}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      )}
      {business.contacts.length > 0 && (
        <AccordionItem>
          <Heading>
            <AccordionButton
              pl='60px'
              width={{
                sm: Number(width.sm),
                md: Number(width.md),
              }}
            >
              <Box
                as='span'
                flex='1'
                textAlign='left'
                fontSize='md'
                fontWeight='bold'
              >
                Contactos
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4} pl='60px'>
            <Box>
              {business.contacts.map((contact) => (
                <Box key={contact.id} mb={4}>
                  <Text>
                    <strong>Nombre:</strong> {contact.name}
                  </Text>
                  {contact.web && (
                    <Text>
                      <strong>Web:</strong> {contact.web}
                    </Text>
                  )}
                  <Text>
                    <strong>Correo Electrónico:</strong> {contact.email}
                  </Text>
                  <Text>
                    <strong>Teléfono:</strong> {contact.phone}
                  </Text>
                </Box>
              ))}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export default DetailHarbors;
