'use client';

import { Box, Text, Popover, Portal } from '@chakra-ui/react';
import React from 'react';
import { DetailField, DetailFields } from '@/components/ui/DetailFields';
import { WeekSummary, WeekSummaryExport } from '@/types/weekSummary';
import { formatDayMonthYearTime } from '@/utils/dayMonthYear';

interface WeeklyExportsSummaryProps {
  exports: WeekSummaryExport[];
  totals: WeekSummary['totals'];
  getExportColor: (exportId?: number) => string;
}

function route(exp: WeekSummaryExport): string {
  return [
    exp.destination.region,
    exp.client.rainforestAlliance && 'RFA',
    [exp.destination.countryCode, exp.destination.harborCode]
      .filter(Boolean)
      .join(''),
    exp.depositCode,
    exp.shippingCompanyCode,
    exp.boxBrand.grossWeightBox && `${exp.boxBrand.grossWeightBox} lb`,
  ]
    .filter(Boolean)
    .join(' · ');
}

function containers(exp: WeekSummaryExport): string {
  const unit = exp.containers === 1 ? 'contenedor' : 'contenedores';
  const size = exp.boxBrand.boxesPerContainer
    ? ` de ${exp.boxBrand.boxesPerContainer} cajas`
    : '';
  return `${exp.containers} ${unit}${size}`;
}

export default function WeeklyExportsSummary({
  exports,
  totals,
  getExportColor,
}: WeeklyExportsSummaryProps): React.JSX.Element {
  const withBoxes = exports.filter((exp) => exp.boxQuantity > 0);

  return (
    <Box display='flex' flexDirection='column' minH='100%'>
      <Text as='h3' textStyle='h3' color='fg.heading' mb={4}>
        Resumen
      </Text>
      <Box flex='1'>
        {withBoxes.length === 0 && (
          <Text fontSize='sm' color='fg.muted'>
            Aún no hay exportaciones para la semana seleccionada.
          </Text>
        )}
        {withBoxes.map((exp) => {
          const color = getExportColor(exp.id);
          const title = `${exp.boxQuantity} cajas · ${exp.boxBrand.brand}`;
          return (
            <Popover.Root
              key={exp.id}
              positioning={{ placement: 'bottom-start' }}
            >
              <Popover.Trigger asChild>
                <Box
                  as='button'
                  w='full'
                  textAlign='left'
                  mb={2}
                  pl={3}
                  pr={2}
                  py={2}
                  borderRadius='l2'
                  borderWidth='1px'
                  borderLeftWidth='4px'
                  borderLeftColor={color}
                  cursor='pointer'
                  _hover={{ bg: 'bg.muted' }}
                >
                  <Text fontSize='sm' fontWeight='semibold'>
                    {title}
                  </Text>
                  <Text fontSize='xs' color='fg.muted'>
                    {route(exp)}
                  </Text>
                  <Text fontSize='xs' color='fg.muted'>
                    {containers(exp)}
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
                        {title}
                      </Popover.Title>
                      <Text fontSize='xs' color='fg.muted'>
                        {route(exp)}
                      </Text>
                    </Popover.Header>
                    <Popover.Body>
                      <DetailFields>
                        <DetailField label='Cajas procesadas'>
                          {exp.boxQuantity}
                        </DetailField>
                        <DetailField label='Cut-off'>
                          {formatDayMonthYearTime(exp.shippingDateTime)}
                        </DetailField>
                        <DetailField label='Productor'>
                          {exp.merchant.name}
                        </DetailField>
                        <DetailField label='Finca'>
                          {exp.business.name}
                        </DetailField>
                        <DetailField label='Marca'>
                          {exp.boxBrand.name} · {exp.boxBrand.brand}
                        </DetailField>
                        <DetailField label='Cliente'>
                          {exp.client.name}
                        </DetailField>
                      </DetailFields>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          );
        })}
      </Box>
      <Box mt={4} pt={4} borderTopWidth='1px'>
        <DetailFields>
          <DetailField label='Contenedores'>{totals.containers}</DetailField>
          <DetailField label='Cajas'>{totals.boxes}</DetailField>
        </DetailFields>
      </Box>
    </Box>
  );
}
