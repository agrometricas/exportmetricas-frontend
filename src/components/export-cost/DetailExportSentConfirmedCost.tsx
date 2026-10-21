'use client';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  SimpleGrid,
  Text,
  Divider,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { ExportSentConfirmedCost } from '../../types/export-sent/exportSentConfirmedCost';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

export default function DetailExportSentConfirmedCost({
  item,
  width,
}: {
  item: ExportSentConfirmedCost;
  width: { sm: number; md: number };
}): JSX.Element {
  const { export: exportData } = item;

  return (
    <Accordion defaultIndex={[0, 1]} allowMultiple>
      <AccordionItem>
        <Heading>
          <AccordionButton pl='60px' width={{ sm: width.sm, md: width.md }}>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información General de la Exportación
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pl='60px' pb={4}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
            <Box>
              <Text fontWeight='bold'>ID Exportación:</Text>
              <Text>{exportData.id}</Text>
            </Box>
            <Box>
              <Text fontWeight='bold'>Fecha de Corte:</Text>
              <Text>
                {formatDayMonthYear(exportData.cuttingDate)}
              </Text>
            </Box>
            <Box>
              <Text fontWeight='bold'>Cajas Exportadas:</Text>
              <Text>{exportData.boxQuantity}</Text>
            </Box>
            <Box>
              <Text fontWeight='bold'>Semana:</Text>
              <Text>{exportData.weekDescription}</Text>
            </Box>
            <Box>
              <Text fontWeight='bold'>Tipo Contrato:</Text>
              <Text>{exportData.contractType}</Text>
            </Box>
            <Box>
              <Text fontWeight='bold'>Buque:</Text>
              <Text>{exportData.shipName}</Text>
            </Box>
            <Box>
              <Text fontWeight='bold'>Booking:</Text>
              <Text>{exportData.bookingNumber}</Text>
            </Box>
          </SimpleGrid>

          <Divider my={4} />

          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
            <Box>
              <Text fontWeight='bold'>Productor:</Text>
              <Text>{exportData.merchant.businessName}</Text>
            </Box>
            <Box>
              <Text fontWeight='bold'>Finca:</Text>
              <Text>{exportData.business.name}</Text>
            </Box>
            <Box>
              <Text fontWeight='bold'>Cliente:</Text>
              <Text>{exportData.client.businessName}</Text>
            </Box>
          </SimpleGrid>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <Heading>
          <AccordionButton pl='60px' width={{ sm: width.sm, md: width.md }}>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalle de Materiales Utilizados
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Heading>
        <AccordionPanel pl='60px' pb={4}>
          {item.exportSentMaterials.length === 0 ? (
            <Text color='gray.500'>
              No se registraron materiales utilizados.
            </Text>
          ) : (
            <VStack align='stretch' spacing={2}>
              {/* Encabezado */}
              <Flex fontWeight='bold' gap={4}>
                <Box flex='1'>Nombre</Box>
                <Box flex='1'>Código</Box>
                <Box flex='1'>Cantidad</Box>
                <Box flex='1'>Costo Unitario</Box>
                <Box flex='1'>Costo Total</Box>
              </Flex>
              <Divider />
              {/* Filas de materiales */}
              {item.exportSentMaterials.map((m) => {
                const mat = m.businessMaterialStock.exporterMaterialStock;
                return (
                  <Flex key={m.id} gap={4}>
                    <Box flex='1'>{mat.materialDetail.name}</Box>
                    <Box flex='1'>{mat.materialDetail.code}</Box>
                    <Box flex='1'>{m.quantity}</Box>
                    <Box flex='1'>${m.unitCost.toFixed(2)}</Box>
                    <Box flex='1'>${(m.unitCost * m.quantity).toFixed(2)}</Box>
                  </Flex>
                );
              })}
            </VStack>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
