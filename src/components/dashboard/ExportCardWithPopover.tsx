'use client';

import { Box, Text, Popover, Portal } from '@chakra-ui/react';
import React from 'react';
import { DetailField, DetailFields } from '@/components/ui/DetailFields';
import { ExportResponse } from '@/types/export.response';
import { formatDayMonthYearTime } from '@/utils/dayMonthYear';

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
    <Popover.Root positioning={{ placement: 'bottom-start' }}>
      <Popover.Trigger asChild>
        <Box
          as='button'
          w='full'
          mb={1}
          px={2}
          py={1.5}
          borderRadius='l1'
          bg={color}
          color='white'
          textAlign='left'
          cursor='pointer'
        >
          <Text fontSize='xs' fontWeight='semibold'>
            {dailyQuantity} cajas
          </Text>
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            minW='360px'
            borderTopWidth='4px'
            borderTopColor={color}
          >
            <Popover.Arrow />
            <Popover.CloseTrigger />
            <Popover.Header>
              <Popover.Title fontWeight='semibold'>
                Exportación {exportData.id}
              </Popover.Title>
            </Popover.Header>
            <Popover.Body>
              <DetailFields>
                <DetailField label='Cut-off'>
                  {formatDayMonthYearTime(exportData.shippingDateTime)}
                </DetailField>
                <DetailField label='Productor'>
                  {exportData.merchant?.businessName}
                </DetailField>
                <DetailField label='Finca'>
                  {exportData.business?.name}
                </DetailField>
                <DetailField label='Marca'>
                  {exportData.boxBrand?.name} ·{' '}
                  {exportData.boxBrand?.brand.name}
                </DetailField>
                <DetailField label='Cliente'>
                  {exportData.client?.businessName}
                </DetailField>
              </DetailFields>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
