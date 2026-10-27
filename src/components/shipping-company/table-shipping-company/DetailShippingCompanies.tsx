import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
} from '@/components/ui/DetailFields';
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
            <DetailFields>
              <DetailField label='Nombre'>{company.name}</DetailField>
              <DetailField label='Código'>{company.code}</DetailField>
              <DetailField label='Frecuencia'>
                {company.frequencies}
              </DetailField>
              <DetailField label='Tipo de Carga'>
                {company.cargoType}
              </DetailField>
              <DetailField label='País'>{company.country.name}</DetailField>
              <DetailField label='Plataforma de Tracking'>
                {company.trackingPlatform || 'No disponible'}
              </DetailField>
            </DetailFields>
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
                <DetailFields>
                  <DetailField label='Puerto de Salida'>
                    {harbor.harborDeparture.name}
                  </DetailField>
                  <DetailField label='Puerto de Llegada'>
                    {harbor.harborDestination.name}
                  </DetailField>
                  <DetailField label='Duración Estimada'>
                    {harbor.estDuration}
                  </DetailField>
                </DetailFields>
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
              <DetailItem key={index}>
                <DetailFields>
                  <DetailField label='Nombre'>{contact.name}</DetailField>
                  <DetailField label='Rol'>
                    {contact.role || 'No especificado'}
                  </DetailField>
                  <DetailField label='Email'>{contact.email}</DetailField>
                  <DetailField label='Teléfono'>{contact.phone}</DetailField>
                </DetailFields>
              </DetailItem>
            ))}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailShippingCompanies;
