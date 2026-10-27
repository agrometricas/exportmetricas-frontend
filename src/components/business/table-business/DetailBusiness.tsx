import { Accordion, Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { BusinessResponse } from '../../../types/merchant/merchant.response';

const DetailBusiness = ({
  business,
  width,
}: {
  business: BusinessResponse;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger
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
              Detalles Generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'><Accordion.ItemBody>
            <Box>
              <Text><strong>Provincia:</strong> {business.province.name}</Text>
              <Text><strong>Ciudad:</strong> {business.city.name}</Text>
              <Text><strong>Dirección:</strong> {business.address}</Text>
              <Text>
                <strong>Dirección:</strong> {business.address}
              </Text>
              <Text>
                <strong>Tipo de Fruta:</strong> {business.fruitType}
              </Text>
            </Box>
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>
      {business.latitude && business.longitude && (
        <Accordion.Item value='item-1'>
          <Heading>
            <Accordion.ItemTrigger
              pl="60px"
              width={{
                sm: Number(width.sm),
                md: Number(width.md),
              }}
            >
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontSize="md"
                fontWeight="bold"
              >
                Geolocalización
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4} pl="60px"><Accordion.ItemBody>
              <Box>
                <Text>
                  <strong>Latitud/Longitud:</strong> {business.latitude}/{business.longitude}
                </Text>
              </Box>
            </Accordion.ItemBody></Accordion.ItemContent>
        </Accordion.Item>
      )}

      <Accordion.Item value='item-2'>
        <Heading>
          <Accordion.ItemTrigger
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
              Códigos
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'><Accordion.ItemBody>
            <Box>
              <Text><strong>Código MAGAP:</strong> {business.codeMAGAP}</Text>
              <Text><strong>Código AGROCALIDAD:</strong> {business.codeAGROCALIDAD}</Text>
            </Box>
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default DetailBusiness;
