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
import { MerchantResponse } from '../../../types/merchant/merchant.response';

const DetailProducers = ({
  business,
  width,
}: {
  business: MerchantResponse;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton
            pl='60px'
            width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalles Generales
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
          <Text><strong>Nombre:</strong> {business.businessName}</Text>
          <Text><strong>ID del Negocio:</strong> {business.businessId}</Text>
          <Text><strong>Correo Electrónico:</strong> {business.email}</Text>
          <Text><strong>Provincia:</strong> {business.province.name}</Text>
          <Text><strong>Ciudad:</strong> {business.city.name}</Text>
          <Text><strong>Dirección:</strong> {business.address}</Text>
          <Text>
            <strong>Tipo de Contrato:</strong> {business.contractType}
          </Text>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <Heading>
          <AccordionButton
            pl='60px'
            width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
          >
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Fincas Asociadas
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
          {business.businesses.map((biz, index) => (
            <Box key={index} mt={4}>
              <Text><strong>Nombre:</strong> {biz.name}</Text>
              <Text><strong>Tipo de Fruta:</strong> {biz.fruitType}</Text>
              <Text><strong>Área:</strong> {biz.area} hectáreas</Text>
              <Text>
                <strong>Hectáreas Aprobadas:</strong>{' '}
                {biz.approvedHectares != null ? `${biz.approvedHectares} ha` : 'N/A'}
              </Text>
              <Text>
                <strong>Cajas Aprobadas por Hectárea:</strong>{' '}
                {biz.approvedBoxesPerHectare ?? 'N/A'}
              </Text>
              <Text>
                <strong>Cajas Totales Aprobadas:</strong>{' '}
                {biz.approvedBoxes ?? 'N/A'}
              </Text>
              <Text><strong>Provincia:</strong> {biz.province.name}</Text>
              <Text><strong>Ciudad:</strong> {biz.city.name}</Text>
              <Text><strong>Dirección:</strong> {biz.address}</Text>
              {biz.latitude && biz.longitude && (
                <Text><strong>Latitud/Longitud:</strong> {biz.latitude}/{biz.longitude}</Text>)}
              <Text><strong>Código MAGAP:</strong> {biz.codeMAGAP}</Text>
              <Text><strong>Código AGROCALIDAD:</strong> {biz.codeAGROCALIDAD}</Text>
            </Box>
          ))}
        </AccordionPanel>
      </AccordionItem>
      {business.bankAccounts.length > 0 && (
        <AccordionItem>
          <Heading>
            <AccordionButton
              pl='60px'
              width={{ sm: `${width.sm}px`, md: `${width.md}px` }}
            >
              <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
                Cuentas Bancarias
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4} pl='60px'>
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
          </AccordionPanel>
        </AccordionItem>)
      }
    </Accordion>
  );
};

export default DetailProducers;
