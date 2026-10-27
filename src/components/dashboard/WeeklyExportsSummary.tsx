'use client';

import { Box, Text, Popover, Portal } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import {
  DetailField,
  DetailFields,
  DetailItem,
} from '@/components/ui/DetailFields';
import { ExportResponse } from '@/types/export.response';
import { formatDayMonthYearTime } from '@/utils/dayMonthYear';

interface WeeklyExportsSummaryProps {
  filteredData: ExportResponse[];
  getExportColor: (exportId?: number) => string;
}

export default function WeeklyExportsSummary({
  filteredData,
  getExportColor,
}: WeeklyExportsSummaryProps): React.JSX.Element {
  const exportGroups = useMemo(() => {
    const groups: Record<
      number,
      { exportId: number; totalBoxes: number; exports: ExportResponse[] }
    > = {};
    filteredData.forEach((exp) => {
      if (!exp.id) return;
      if (!groups[exp.id]) {
        groups[exp.id] = { exportId: exp.id, totalBoxes: 0, exports: [] };
      }
      groups[exp.id].totalBoxes += exp.boxQuantity;
      groups[exp.id].exports.push(exp);
    });
    return Object.values(groups).filter((group) => group.totalBoxes > 0);
  }, [filteredData]);

  const totalBoxes = useMemo(
    () => filteredData.reduce((acc, exp) => acc + exp.boxQuantity, 0),
    [filteredData]
  );
  const totalContainers = exportGroups.reduce((accGroup, group) => {
    const groupContainers = group.exports.reduce((accExp, exp) => {
      const boxesPerContainer = exp.boxBrand.boxQuantity || 1;
      return accExp + Math.ceil(exp.boxQuantity / boxesPerContainer);
    }, 0);
    return accGroup + groupContainers;
  }, 0);
  return (
    <Box display='flex' flexDirection='column' minH='100%'>
      <Text as='h3' textStyle='h3' color='fg.heading' mb={4}>
        Resumen
      </Text>
      <Box flex='1'>
        {exportGroups.length === 0 && (
          <Text fontSize='sm' color='fg.muted'>
            Aún no hay exportaciones para la semana seleccionada.
          </Text>
        )}
        {exportGroups.map((group) => {
          const color = getExportColor(group.exportId);
          const first = group.exports[0];
          const groupContainers = group.exports.reduce((acc, exp) => {
            const boxesPerContainer = exp.boxBrand.boxQuantity || 1;
            return acc + Math.ceil(exp.boxQuantity / boxesPerContainer);
          }, 0);
          const certificates = first.client?.certificates;
          const rainforest =
            Array.isArray(certificates) &&
            certificates.some(
              (item) => item.certificate?.name === 'RAINFOREST ALLIANCE'
            );
          const route = [
            first.harborDestination?.country?.region,
            rainforest && 'RFA',
            [
              first.harborDestination?.country?.code,
              first.harborDestination?.code,
            ]
              .filter(Boolean)
              .join(''),
            first.deposit?.code,
            first.shippingCompany?.code,
            first.boxBrand?.grossWeightBox &&
              `${first.boxBrand.grossWeightBox} lb`,
          ]
            .filter(Boolean)
            .join(' · ');
          const containers = `${groupContainers} ${
            groupContainers === 1 ? 'contenedor' : 'contenedores'
          }${first.boxBrand?.boxQuantity ? ` de ${first.boxBrand.boxQuantity} cajas` : ''}`;
          return (
            <Popover.Root
              key={group.exportId}
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
                    {group.totalBoxes} cajas · {first.boxBrand?.brand.name}
                  </Text>
                  <Text fontSize='xs' color='fg.muted'>
                    {route}
                  </Text>
                  <Text fontSize='xs' color='fg.muted'>
                    {containers}
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
                        {group.totalBoxes} cajas · {first.boxBrand?.brand.name}
                      </Popover.Title>
                      <Text fontSize='xs' color='fg.muted'>
                        {route}
                      </Text>
                    </Popover.Header>
                    <Popover.Body>
                      {group.exports.map((exp) => (
                        <DetailItem key={exp.id}>
                          <DetailFields>
                            <DetailField label='Cajas procesadas'>
                              {exp.boxQuantity}
                            </DetailField>
                            <DetailField label='Cut-off'>
                              {formatDayMonthYearTime(exp.shippingDateTime)}
                            </DetailField>
                            <DetailField label='Productor'>
                              {exp.merchant?.businessName}
                            </DetailField>
                            <DetailField label='Finca'>
                              {exp.business?.name}
                            </DetailField>
                            <DetailField label='Marca'>
                              {exp.boxBrand?.name} · {exp.boxBrand?.brand.name}
                            </DetailField>
                            <DetailField label='Cliente'>
                              {exp.client?.businessName}
                            </DetailField>
                          </DetailFields>
                        </DetailItem>
                      ))}
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
          <DetailField label='Contenedores'>{totalContainers}</DetailField>
          <DetailField label='Cajas'>{totalBoxes}</DetailField>
        </DetailFields>
      </Box>
    </Box>
  );
}
