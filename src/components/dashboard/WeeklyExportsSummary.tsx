'use client';

import { Box, Text, Popover } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { ExportResponse } from '@/types/export.response';

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
        {exportGroups.map((group) => {
          const color = getExportColor(group.exportId);
          const tenueColor = `color-mix(in srgb, ${color} 50%, transparent)`;
          const groupContainers = group.exports.reduce((acc, exp) => {
            const boxesPerContainer = exp.boxBrand.boxQuantity || 1;
            return acc + Math.ceil(exp.boxQuantity / boxesPerContainer);
          }, 0);
          return (
            <Popover.Root
              key={group.exportId}
              positioning={{
                placement: 'bottom-start',
              }}
            >
              <Popover.Trigger asChild>
                <Box
                  mb={2}
                  borderRadius='md'
                  cursor='pointer'
                  display={'flex'}
                  borderWidth='1px'
                  borderColor={tenueColor}
                  alignItems={'stretch'}
                  boxShadow={'md'}
                >
                  <Box
                    w='20px'
                    bg={color}
                    borderTopLeftRadius='md'
                    borderBottomLeftRadius='md'
                    borderTopRightRadius='0'
                    borderBottomRightRadius='0'
                    mr={2}
                  />
                  <Text fontWeight='bold' p={2}>
                    {group.totalBoxes} {group.exports[0].boxBrand?.brand.name}{' '}
                    {group.exports[0].harborDestination?.country?.region} (
                    {group.exports[0].boxBrand?.boxQuantity}){' '}
                    {((): string => {
                      const certificates =
                        group.exports[0].client?.certificates;
                      if (Array.isArray(certificates)) {
                        return certificates.some(
                          (item) =>
                            item.certificate?.name === 'RAINFOREST ALLIANCE'
                        )
                          ? 'RFA'
                          : '';
                      }
                      return '';
                    })()}{' '}
                    {group.exports[0].harborDestination?.country?.code}{' '}
                    {group.exports[0].harborDestination?.code}{' '}
                    {group.exports[0].deposit?.code}{' '}
                    {group.exports[0].shippingCompany?.code}{' '}
                    {group.exports[0].boxBrand?.grossWeightBox}
                    {'LBS'} - Contenedores: {groupContainers}
                  </Text>
                </Box>
              </Popover.Trigger>
              <Popover.Positioner>
                <Popover.Content
                  minW='400px'
                  borderColor={color}
                  borderWidth='4px'
                >
                  <Popover.Arrow />
                  <Popover.CloseTrigger />
                  <Popover.Title>
                    {group.totalBoxes} {group.exports[0].boxBrand?.brand.name}{' '}
                    {group.exports[0].harborDestination?.country?.region} (
                    {group.exports[0].boxBrand?.boxQuantity}){' '}
                    {((): string => {
                      const certificates =
                        group.exports[0].client?.certificates;
                      if (Array.isArray(certificates)) {
                        return certificates.some(
                          (item) =>
                            item.certificate?.name === 'RAINFOREST ALLIANCE'
                        )
                          ? 'RFA'
                          : '';
                      }
                      return '';
                    })()}{' '}
                    {group.exports[0].harborDestination?.country?.code}{' '}
                    {group.exports[0].harborDestination?.code}{' '}
                    {group.exports[0].deposit?.code}{' '}
                    {group.exports[0].shippingCompany?.code}{' '}
                    {group.exports[0].boxBrand?.grossWeightBox}
                    {'LBS'}
                  </Popover.Title>
                  <Popover.Body>
                    {group.exports.map((exp) => (
                      <Box key={exp.id} mb={2}>
                        <Text>
                          <strong>Cajas Procesadas:</strong> {exp.boxQuantity}
                        </Text>
                        <Text>
                          <strong>Cut-Off:</strong>{' '}
                          {exp.shippingDateTime ?? 'Sin hora asignada'}
                        </Text>
                        <Text>
                          <strong>Productor:</strong>{' '}
                          {exp.merchant?.businessName ?? 'Sin productor'}
                        </Text>
                        <Text>
                          <strong>Finca:</strong>{' '}
                          {exp.business?.name ?? 'Sin finca'}
                        </Text>
                        <Text>
                          <strong>Marca:</strong>{' '}
                          {exp.boxBrand?.name ?? 'Sin marca'}
                          {' - '}
                          {exp.boxBrand?.brand.name ?? 'Sin marca'}
                        </Text>
                        <Text>
                          <strong>Cliente:</strong>{' '}
                          {exp.client?.businessName ?? 'Sin cliente'}
                        </Text>
                        <Text>
                          <strong>Contenedores:</strong> {groupContainers}
                        </Text>
                      </Box>
                    ))}
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>
          );
        })}
      </Box>
      <Box mt='auto' textAlign='center'>
        <Text fontWeight='bold'>Total Contenedores: {totalContainers}</Text>
        <Text fontWeight='bold'>Total Cajas: {totalBoxes}</Text>
      </Box>
    </Box>
  );
}
