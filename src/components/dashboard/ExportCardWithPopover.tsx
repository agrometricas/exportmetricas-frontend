'use client';

import { Box, Text, Popover } from '@chakra-ui/react';
import React from 'react';
import { ExportResponse } from '@/types/export.response';

interface ExportCardWithPopoverProps {
  exportData: ExportResponse;
  color: string;
  dailyQuantity: number;
}

export default function ExportCardWithPopover({
  exportData,
  color,
  dailyQuantity,
}: ExportCardWithPopoverProps): React.JSX.Element {
  return (
    <Popover.Root
      positioning={{
        placement: 'bottom-start',
      }}
    >
      <Popover.Trigger asChild>
        <Box
          mb={2}
          p={2}
          borderRadius='md'
          bg={color}
          color='white'
          fontSize='sm'
          boxShadow='md'
          cursor='pointer'
        >
          <Text fontWeight='bold'>{dailyQuantity} cajas</Text>
        </Box>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content minW='400px' borderColor={color} borderWidth='4px'>
          <Popover.Arrow />
          <Popover.CloseTrigger />
          <Popover.Title>
            <strong>Detalle de Exportación</strong>
          </Popover.Title>
          <Popover.Body>
            <Text>
              <strong>Cut-Off:</strong>{' '}
              {exportData.shippingDateTime ?? 'Sin hora asignada'}
            </Text>
            <Text>
              <strong>Productor:</strong>{' '}
              {exportData.merchant?.businessName ?? 'Sin productor'}
            </Text>
            <Text>
              <strong>Finca:</strong> {exportData.business?.name ?? 'Sin finca'}
            </Text>
            <Text>
              <strong>Marca:</strong> {exportData.boxBrand?.name ?? 'Sin marca'}
              {' - '}
              {exportData.boxBrand?.brand.name ?? 'Sin marca'}
            </Text>
            <Text>
              <strong>Cliente:</strong>{' '}
              {exportData.client?.businessName ?? 'Sin cliente'}
            </Text>
          </Popover.Body>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
}
