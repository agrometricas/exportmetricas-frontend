'use client';
import { Accordion, Box, Heading, SimpleGrid, Text, VStack, Flex, Separator } from '@chakra-ui/react';
import React from 'react';

import { ExportSentConfirmedCost } from '../../types/export-sent/exportSentConfirmedCost';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

export default function DetailExportSentConfirmedCost({
  item,
}: {
  item: ExportSentConfirmedCost;
}): React.JSX.Element {
  const { export: exportData } = item;

  return (
    <Accordion.Root defaultValue={['0', '1']} multiple>
      <Accordion.Item value='item-0'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Información general de la exportación
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}><Accordion.ItemBody>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
              <Box>
                <Text fontWeight='bold'>ID exportación:</Text>
                <Text>{exportData.id}</Text>
              </Box>
              <Box>
                <Text fontWeight='bold'>Fecha de corte:</Text>
                <Text>
                  {formatDayMonthYear(exportData.cuttingDate)}
                </Text>
              </Box>
              <Box>
                <Text fontWeight='bold'>Cajas exportadas:</Text>
                <Text>{exportData.boxQuantity}</Text>
              </Box>
              <Box>
                <Text fontWeight='bold'>Semana:</Text>
                <Text>{exportData.weekDescription}</Text>
              </Box>
              <Box>
                <Text fontWeight='bold'>Tipo contrato:</Text>
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

            <Separator my={4} />

            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
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
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value='item-1'>
        <Heading>
          <Accordion.ItemTrigger>
            <Box flex='1' textAlign='left' fontSize='md' fontWeight='bold'>
              Detalle de materiales utilizados
            </Box>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </Heading>
        <Accordion.ItemContent pb={4}><Accordion.ItemBody>
            {item.exportSentMaterials.length === 0 ? (
              <Text color='fg.muted'>
                No se registraron materiales utilizados.
              </Text>
            ) : (
              <VStack align='stretch' gap={2}>
                {/* Encabezado */}
                <Flex fontWeight='bold' gap={4}>
                  <Box flex='1'>Nombre</Box>
                  <Box flex='1'>Código</Box>
                  <Box flex='1'>Cantidad</Box>
                  <Box flex='1'>Costo unitario</Box>
                  <Box flex='1'>Costo total</Box>
                </Flex>
                <Separator />
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
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}
