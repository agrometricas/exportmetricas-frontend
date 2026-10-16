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
import { BusinessResponse } from '../../../types/merchant/merchant.response';

const DetailBusiness = ({
  business,
  width,
}: {
  business: BusinessResponse;
  width: { sm: number; md: number };
}): React.JSX.Element => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton
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
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
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
            <Text>
              <strong>Hectáreas Aprobadas:</strong>{' '}
              {business.approvedHectares != null
                ? `${business.approvedHectares} ha`
                : 'N/A'}
            </Text>
            <Text>
              <strong>Cajas Aprobadas por Hectárea:</strong>{' '}
              {business.approvedBoxesPerHectare ?? 'N/A'}
            </Text>
            <Text>
              <strong>Cajas Totales Aprobadas:</strong>{' '}
              {business.approvedBoxes ?? 'N/A'}
            </Text>
          </Box>
        </AccordionPanel>
      </AccordionItem>
      {business.latitude && business.longitude && (
        <AccordionItem>
          <Heading>
            <AccordionButton
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
              <AccordionIcon />
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4} pl="60px">
            <Box>
              <Text>
                <strong>Latitud/Longitud:</strong> {business.latitude}/{business.longitude}
              </Text>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      )}

      <AccordionItem>
        <Heading>
          <AccordionButton
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
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pb={4} pl='60px'>
          <Box>
            <Text><strong>Código MAGAP:</strong> {business.codeMAGAP}</Text>
            <Text><strong>Código AGROCALIDAD:</strong> {business.codeAGROCALIDAD}</Text>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DetailBusiness;
