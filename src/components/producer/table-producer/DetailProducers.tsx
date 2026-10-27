import { Accordion, Box, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { MerchantResponse } from '../../../types/merchant/merchant.response';

const DetailProducers = ({
  business,
  width,
}: {
  business: MerchantResponse;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  return (
    <Accordion.Root defaultValue={['item-0']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles Generales
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'><Accordion.ItemBody>
            <Text><strong>Nombre:</strong> {business.businessName}</Text>
            <Text><strong>ID del Negocio:</strong> {business.businessId}</Text>
            <Text><strong>Correo Electrónico:</strong> {business.email}</Text>
            <Text><strong>Provincia:</strong> {business.province.name}</Text>
            <Text><strong>Ciudad:</strong> {business.city.name}</Text>
            <Text><strong>Dirección:</strong> {business.address}</Text>
            <Text>
              <strong>Tipo de Contrato:</strong> {business.contractType}
            </Text>
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger
            pl='60px'
            width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Fincas Asociadas
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4} pl='60px'><Accordion.ItemBody>
            {business.businesses.map((biz, index) => (
              <Box key={index} mt={4}>
                <Text><strong>Nombre:</strong> {biz.name}</Text>
                <Text><strong>Tipo de Fruta:</strong> {biz.fruitType}</Text>
                <Text><strong>Área:</strong> {biz.area} hectáreas</Text>
                <Text><strong>Provincia:</strong> {biz.province.name}</Text>
                <Text><strong>Ciudad:</strong> {biz.city.name}</Text>
                <Text><strong>Dirección:</strong> {biz.address}</Text>
                {biz.latitude && biz.longitude && (
                  <Text><strong>Latitud/Longitud:</strong> {biz.latitude}/{biz.longitude}</Text>)}
                <Text><strong>Código MAGAP:</strong> {biz.codeMAGAP}</Text>
                <Text><strong>Código AGROCALIDAD:</strong> {biz.codeAGROCALIDAD}</Text>
              </Box>
            ))}
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>
      {business.bankAccounts.length > 0 && (
        <Accordion.Item value='item-2'>
          <Heading>
            <Accordion.ItemTrigger
              pl='60px'
              width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
            >
              <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
                Cuentas Bancarias
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent pb={4} pl='60px'><Accordion.ItemBody>
              {business.bankAccounts.map((acc, i) => (
                <Box key={i} mt={4}>
                  <Text><strong>Banco:</strong> {acc.bank}</Text>
                  <Text><strong>Propietario:</strong> {acc.owner}</Text>
                  <Text><strong>ID Propietario:</strong> {acc.ownerID}</Text>
                  <Text><strong>Número de Cuenta:</strong> {acc.accountNumber}</Text>
                  <Text><strong>Tipo de Cuenta:</strong> {acc.type}</Text>
                  <Text><strong>Email:</strong> {acc.email}</Text>
                </Box>
              ))}
            </Accordion.ItemBody></Accordion.ItemContent>
        </Accordion.Item>)
      }
    </Accordion.Root>
  );
};

export default DetailProducers;
