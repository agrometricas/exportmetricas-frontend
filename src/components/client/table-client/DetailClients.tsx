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
import { ClientResponse } from '../../../types/client.response';

const DetailClients = ({
  client,
  width,
}: {
  client: ClientResponse;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton
            pl="60px"
            width={{
              sm: Number(width.sm),
              md: Number(width.md),
            }}
          >
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Datos Generales
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <Box>
            <Text><strong>Nombre:</strong> {client.businessName}</Text>
            <Text><strong>RUC:</strong> {client.businessId}</Text>
            <Text><strong>Tipo:</strong> {client.type}</Text>
            <Text><strong>Tipo Comercial:</strong> {client.commercialType}</Text>
            <Text><strong>Correo:</strong> {client.email}</Text>
            <Text><strong>Teléfono:</strong> {client.phone}</Text>
            {client.website &&
              (<Text><strong>Sitio Web:</strong> {client.website || 'N/A'}</Text>
              )}
            {client.paymentTermLabel && (
              <Text><strong>Condiciones de Pago:</strong> {client.paymentTermLabel}</Text>
            )}
            {client.purchaseVolumeLabel && (
              <Text><strong>Volumen de Compra:</strong> {client.purchaseVolumeLabel}</Text>
            )}
            <Text><strong>Método de Envío:</strong> {client.shippingMethod || 'N/A'}</Text>
          </Box>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton
            pl="60px"
            width={{
              sm: Number(width.sm),
              md: Number(width.md),
            }}
          >
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Ubicación
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <Box>
            <Text><strong>Dirección:</strong> {client.address}</Text>
            <Text><strong>Código Postal:</strong> {client.postalCode}</Text>
            <Text><strong>País:</strong> {client.country?.name}</Text>
            <Text><strong>Provincia:</strong> {client.province?.name}</Text>
            <Text><strong>Ciudad:</strong> {client.city?.name}</Text>
          </Box>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton
            pl="60px"
            width={{
              sm: Number(width.sm),
              md: Number(width.md),
            }}
          >
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Puertos
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <Box>
            {client.harbors?.length > 0 ? (
              client.harbors.map((harbor) => (
                <Box key={harbor.id} mb={2}>
                  <Text><strong>Nombre:</strong> {harbor.name}</Text>
                </Box>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton
            pl="60px"
            width={{
              sm: Number(width.sm),
              md: Number(width.md),
            }}
          >
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Incoterms
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <Box>
            {client.incoterms?.length > 0 ? (
              client.incoterms.map((incoterm) => (
                <Box key={incoterm.id} mb={2}>
                  <Text>{incoterm.name}</Text>
                </Box>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton
            pl="60px"
            width={{
              sm: Number(width.sm),
              md: Number(width.md),
            }}
          >
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Certificados
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <Box>
            {client.certificates?.length > 0 ? (
              client.certificates.map((cert) => (
                <Box key={cert.certificate.id} mb={2}>
                  <Text>{cert.certificate.name}</Text>
                </Box>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton
            pl="60px"
            width={{
              sm: Number(width.sm),
              md: Number(width.md),
            }}
          >
            <Box flex="1" textAlign="left" fontSize="md" fontWeight="bold">
              Contactos
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl="60px">
          <Box>
            {client.contacts?.length > 0 ? (
              client.contacts.map((contact) => (
                <Box key={contact.id} mb={4}>
                  <Text><strong>Nombre:</strong> {contact.name}</Text>
                  <Text><strong>Rol:</strong> {contact.role}</Text>
                  <Text><strong>Email:</strong> {contact.email}</Text>
                  <Text><strong>Teléfono:</strong> {contact.phone}</Text>
                </Box>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DetailClients;
