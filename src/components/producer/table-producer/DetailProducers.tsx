import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
} from '@/components/ui/DetailFields';
import { MerchantResponse } from '../../../types/merchant/merchant.response';

const DetailProducers = ({
  business,
}: {
  business: MerchantResponse;
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
              <DetailField label='Nombre'>{business.businessName}</DetailField>
              <DetailField label='ID del negocio'>
                {business.businessId}
              </DetailField>
              <DetailField label='Correo electrónico'>
                {business.email}
              </DetailField>
              <DetailField label='Provincia'>
                {business.province.name}
              </DetailField>
              <DetailField label='Ciudad'>{business.city.name}</DetailField>
              <DetailField label='Dirección'>{business.address}</DetailField>
              <DetailField label='Tipo de contrato'>
                {business.contractType}
              </DetailField>
            </DetailFields>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Fincas Asociadas
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            {business.businesses.map((biz, index) => (
              <DetailItem key={index}>
                <DetailFields>
                  <DetailField label='Nombre'>{biz.name}</DetailField>
                  <DetailField label='Tipo de fruta'>
                    {biz.fruitType}
                  </DetailField>
                  <DetailField label='Área'>{biz.area} hectáreas</DetailField>
                  <DetailField label='Provincia'>
                    {biz.province.name}
                  </DetailField>
                  <DetailField label='Ciudad'>{biz.city.name}</DetailField>
                  <DetailField label='Dirección'>{biz.address}</DetailField>
                  {biz.latitude && biz.longitude && (
                    <DetailField label='Latitud/Longitud'>
                      {biz.latitude}/{biz.longitude}
                    </DetailField>
                  )}
                  <DetailField label='Código MAGAP'>
                    {biz.codeMAGAP}
                  </DetailField>
                  <DetailField label='Código AGROCALIDAD'>
                    {biz.codeAGROCALIDAD}
                  </DetailField>
                </DetailFields>
              </DetailItem>
            ))}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      {business.bankAccounts.length > 0 && (
        <Accordion.Item value='item-2'>
          <Heading>
            <Accordion.ItemTrigger>
              <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
                Cuentas Bancarias
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}>
            <Accordion.ItemBody>
              {business.bankAccounts.map((acc, i) => (
                <DetailItem key={i}>
                  <DetailFields>
                    <DetailField label='Banco'>{acc.bank}</DetailField>
                    <DetailField label='Propietario'>{acc.owner}</DetailField>
                    <DetailField label='ID propietario'>
                      {acc.ownerID}
                    </DetailField>
                    <DetailField label='Número de cuenta'>
                      {acc.accountNumber}
                    </DetailField>
                    <DetailField label='Tipo de cuenta'>{acc.type}</DetailField>
                    <DetailField label='Email'>{acc.email}</DetailField>
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

export default DetailProducers;
