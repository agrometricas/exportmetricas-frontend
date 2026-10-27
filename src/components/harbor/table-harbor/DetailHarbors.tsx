import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
} from '@/components/ui/DetailFields';
import { HarborResponse } from '../../../types/harbor.response';
interface DetailHarborsProps {
  business: HarborResponse;
}

const DetailHarbors: React.FC<DetailHarborsProps> = ({ business }) => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box
              as='span'
              flex='1'
              textAlign='left'
              fontSize='md'
              fontWeight='bold'
            >
              Detalles del Puerto
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Nombre'>{business.name}</DetailField>
                <DetailField label='Código'>{business.code}</DetailField>
                <DetailField label='Dirección'>{business.address}</DetailField>
                <DetailField label='Ubicación'>{business.location}</DetailField>
                <DetailField label='País'>
                  {business.country?.name ?? '—'}
                </DetailField>
                <DetailField label='Provincia'>
                  {business.province?.name ?? '—'}
                </DetailField>
                <DetailField label='Ciudad'>
                  {business.city?.name ?? '—'}
                </DetailField>
                <DetailField label='Tipo'>{business.type}</DetailField>
                {business.latitude && business.longitude && (
                  <>
                    <DetailField label='Latitud'>
                      {business.latitude ?? 'N/A'}
                    </DetailField>
                    <DetailField label='Longitud'>
                      {business.longitude ?? 'N/A'}
                    </DetailField>
                  </>
                )}
                <DetailField label='Horario de apertura'>
                  {business.openTime}
                </DetailField>
                <DetailField label='Horario de cierre'>
                  {business.closeTime}
                </DetailField>
                <DetailField label='Días de operación'>
                  {business.daysOfOperation.join(', ')}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      {business.clients.length > 0 && (
        <Accordion.Item value='item-1'>
          <Heading>
            <Accordion.ItemTrigger>
              <Box
                as='span'
                flex='1'
                textAlign='left'
                fontSize='md'
                fontWeight='bold'
              >
                Clientes
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}>
            <Accordion.ItemBody>
              <Box>
                {business.clients.map((client) => (
                  <DetailItem key={client.id}>
                    <DetailFields>
                      <DetailField label='Nombre'>
                        {client.businessName}
                      </DetailField>
                      <DetailField label='RUC'>{client.businessId}</DetailField>
                      <DetailField label='Tipo'>{client.type}</DetailField>
                      <DetailField label='Correo electrónico'>
                        {client.email}
                      </DetailField>
                      <DetailField label='Teléfono'>{client.phone}</DetailField>
                    </DetailFields>
                  </DetailItem>
                ))}
              </Box>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      )}
      {business.contacts.length > 0 && (
        <Accordion.Item value='item-2'>
          <Heading>
            <Accordion.ItemTrigger>
              <Box
                as='span'
                flex='1'
                textAlign='left'
                fontSize='md'
                fontWeight='bold'
              >
                Contactos
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}>
            <Accordion.ItemBody>
              <Box>
                {business.contacts.map((contact) => (
                  <DetailItem key={contact.id}>
                    <DetailFields>
                      <DetailField label='Nombre'>{contact.name}</DetailField>
                      {contact.web && (
                        <DetailField label='Web'>{contact.web}</DetailField>
                      )}
                      <DetailField label='Correo electrónico'>
                        {contact.email}
                      </DetailField>
                      <DetailField label='Teléfono'>
                        {contact.phone}
                      </DetailField>
                    </DetailFields>
                  </DetailItem>
                ))}
              </Box>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      )}
    </Accordion.Root>
  );
};

export default DetailHarbors;
