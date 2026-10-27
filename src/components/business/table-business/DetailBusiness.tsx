import { Accordion, Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { DetailField, DetailFields } from '@/components/ui/DetailFields';
import { BusinessResponse } from '../../../types/merchant/merchant.response';

const DetailBusiness = ({
  business,
}: {
  business: BusinessResponse;
}): React.JSX.Element => {
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
              Detalles Generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Provincia'>
                  {business.province.name}
                </DetailField>
                <DetailField label='Ciudad'>{business.city.name}</DetailField>
                <DetailField label='Dirección'>{business.address}</DetailField>
                <DetailField label='Dirección'>{business.address}</DetailField>
                <DetailField label='Tipo de fruta'>
                  {business.fruitType}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
      {business.latitude && business.longitude && (
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
                Geolocalización
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4}>
            <Accordion.ItemBody>
              <Box>
                <DetailFields>
                  <DetailField label='Latitud/Longitud'>
                    {business.latitude}/{business.longitude}
                  </DetailField>
                </DetailFields>
              </Box>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      )}

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
              Códigos
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}>
          <Accordion.ItemBody>
            <Box>
              <DetailFields>
                <DetailField label='Código MAGAP'>
                  {business.codeMAGAP}
                </DetailField>
                <DetailField label='Código AGROCALIDAD'>
                  {business.codeAGROCALIDAD}
                </DetailField>
              </DetailFields>
            </Box>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailBusiness;
