import { Box, Button, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { AxiosResponse, AxiosError } from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from 'react';
import { BiDownload } from 'react-icons/bi';
import { toaster } from '@/components/ui/toaster';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useDownloadMaterialsSummaryReport } from '../../hooks/utils/useDownloadMaterialsSummaryReport';
import { ServerErrorResponse } from '../../types/errorResponse';
import { FarmWeek } from '../../types/weekSummary';

interface WeeklyFarmSummaryCardProps {
  farms: FarmWeek[];
  weekStart: Date;
  weekEnd: Date;
  getExportColor: (exportId?: number) => string;
}

export const WeeklyFarmSummaryCard = ({
  farms,
  weekStart,
  weekEnd,
  getExportColor,
}: WeeklyFarmSummaryCardProps): React.JSX.Element | null => {
  const { mutate: downloadReport } = useDownloadMaterialsSummaryReport({
    onSuccess: (response: AxiosResponse<Blob>) => {
      const formattedStart = format(weekStart, 'd');
      const formattedEnd = format(weekEnd, 'd');
      const formattedMonth = format(weekStart, 'MMMM', { locale: es });
      const formattedYear = format(weekStart, 'yyyy');
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte-Materiales-${formattedStart}-${formattedEnd}-${formattedMonth}-${formattedYear}.xlsx`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: AxiosError<ServerErrorResponse>) => {
      toaster.create({
        type: 'error',
        title: 'No se pudo descargar el reporte',
        description: serverErrorMessage(error),
      });
    },
  });

  const header = (
    <Flex justify='space-between' align='center' gap={3} wrap='wrap' mb={4}>
      <Text as='h3' textStyle='h3' color='fg.heading'>
        Exportaciones por finca
      </Text>
      <Button
        size='sm'
        variant='outline'
        onClick={() => downloadReport(weekStart.toISOString())}
      >
        <BiDownload />
        Descargar reporte
      </Button>
    </Flex>
  );

  if (farms.length === 0) {
    return (
      <Box>
        {header}
        <Text fontSize='sm' color='fg.muted'>
          Aún no hay envíos de insumos para la semana seleccionada.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {header}
      <SimpleGrid minChildWidth='200px' gap={3}>
        {farms.map((farm) => (
          <Flex
            key={farm.business.id}
            direction='column'
            gap={2}
            p={3}
            borderWidth='1px'
            borderRadius='l2'
          >
            <Box>
              <Text fontSize='sm' fontWeight='semibold'>
                {farm.business.name}
              </Text>
              <Text fontSize='xs' color='fg.muted'>
                {farm.merchant.name}
              </Text>
            </Box>
            <VStack align='stretch' gap={1}>
              {farm.shipments.map((shipment) => (
                <Flex key={shipment.exportId} align='center' gap={2}>
                  <Box
                    boxSize={2}
                    flexShrink={0}
                    borderRadius='full'
                    bg={getExportColor(shipment.exportId)}
                  />
                  <Text fontSize='xs'>
                    {shipment.boxes} cajas · {shipment.boxBrand} ·{' '}
                    {shipment.grossWeightBox} lb
                  </Text>
                </Flex>
              ))}
            </VStack>
            <Flex
              mt='auto'
              pt={2}
              borderTopWidth='1px'
              justify='space-between'
              fontSize='xs'
            >
              <Text color='fg.muted'>Total</Text>
              <Text fontWeight='semibold' fontVariantNumeric='tabular-nums'>
                {farm.boxes} cajas
              </Text>
            </Flex>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};
