import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
} from '@/components/ui/DetailFields';
import { DepositResponse } from '../../../types/deposit/deposit.response';

interface DetailDepositsProps {
  deposit: DepositResponse;
}

const DetailDeposits: React.FC<DetailDepositsProps> = ({ deposit }) => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles del Depósito
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <DetailFields>
              <DetailField label='Nombre'>{deposit.name}</DetailField>
              <DetailField label='Código'>{deposit.code}</DetailField>
              <DetailField label='Dirección'>{deposit.address}</DetailField>
              <DetailField label='Ciudad'>{deposit.city.name}</DetailField>
              <DetailField label='Hora de Apertura'>
                {deposit.openTime}
              </DetailField>
              <DetailField label='Hora de Cierre'>
                {deposit.closeTime}
              </DetailField>
              {deposit.latitude && deposit.longitude && (
                <DetailField label='Latitud / Longitud'>
                  {deposit.latitude}, {deposit.longitude}
                </DetailField>
              )}
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      {deposit.contacts.length > 0 && (
        <Accordion.Item value='item-1'>
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
              {deposit.contacts.map((contact, index) => (
                <DetailItem key={index}>
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

export default DetailDeposits;
