import { Accordion, Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
} from '@/components/ui/DetailFields';
import { ClientResponse } from '../../../types/client.response';

const DetailClients = ({
  client,
}: {
  client: ClientResponse;
}): React.JSX.Element => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Datos generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Nombre'>{client.businessName}</DetailField>
                <DetailField label='RUC'>{client.businessId}</DetailField>
                <DetailField label='Tipo'>{client.type}</DetailField>
                <DetailField label='Tipo comercial'>
                  {client.commercialType}
                </DetailField>
                <DetailField label='Correo'>{client.email}</DetailField>
                <DetailField label='Teléfono'>{client.phone}</DetailField>
                {client.website && (
                  <DetailField label='Sitio web'>
                    {client.website || 'N/A'}
                  </DetailField>
                )}
                {client.paymentTermLabel && (
                  <DetailField label='Condiciones de pago'>
                    {client.paymentTermLabel}
                  </DetailField>
                )}
                {client.purchaseVolumeLabel && (
                  <DetailField label='Volumen de compra'>
                    {client.purchaseVolumeLabel}
                  </DetailField>
                )}
                <DetailField label='Método de envío'>
                  {client.shippingMethod || 'N/A'}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Ubicación
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Dirección'>{client.address}</DetailField>
                <DetailField label='Código postal'>
                  {client.postalCode}
                </DetailField>
                <DetailField label='País'>{client.country?.name}</DetailField>
                <DetailField label='Provincia'>
                  {client.province?.name}
                </DetailField>
                <DetailField label='Ciudad'>{client.city?.name}</DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-2'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Puertos
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              {client.harbors?.length > 0 ? (
                client.harbors.map((harbor) => (
                  <DetailItem key={harbor.id}>
                    <DetailFields>
                      <DetailField label='Nombre'>{harbor.name}</DetailField>
                    </DetailFields>
                  </DetailItem>
                ))
              ) : (
                <Text>N/A</Text>
              )}
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-3'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Incoterms
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
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
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-4'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Certificados
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
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
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-5'>
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
            <Box>
              {client.contacts?.length > 0 ? (
                client.contacts.map((contact) => (
                  <DetailItem key={contact.id}>
                    <DetailFields>
                      <DetailField label='Nombre'>{contact.name}</DetailField>
                      <DetailField label='Rol'>{contact.role}</DetailField>
                      <DetailField label='Email'>{contact.email}</DetailField>
                      <DetailField label='Teléfono'>
                        {contact.phone}
                      </DetailField>
                    </DetailFields>
                  </DetailItem>
                ))
              ) : (
                <Text>N/A</Text>
              )}
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailClients;
