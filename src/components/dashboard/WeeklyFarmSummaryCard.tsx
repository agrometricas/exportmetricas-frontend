import { Box, Button, Flex, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { AxiosResponse, AxiosError } from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { BiDownload } from 'react-icons/bi';
import { toaster } from '@/components/ui/toaster';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { useDownloadMaterialsSummaryReport } from '../../hooks/utils/useDownloadMaterialsSummaryReport';
import { ServerErrorResponse } from '../../types/errorResponse';
import { ExportSentType } from '../../types/exportSent.response';

interface WeeklyFarmSummaryCardProps {
  exportSentData: ExportSentType[];
  weekStart: Date;
  weekEnd: Date;
  getExportColor: (exportId?: number) => string;
  selectedProducer?: string;
  selectedBoxBrand?: string;
  selectedClient?: string;
}

export const WeeklyFarmSummaryCard = ({
  exportSentData,
  weekStart,
  weekEnd,
  getExportColor,
  selectedProducer = '',
  selectedBoxBrand = '',
  selectedClient = '',
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

  const filteredData = useMemo(() => {
    return exportSentData.filter((sent) => {
      if (!sent?.export?.cuttingDate) return false;
      const cuttingDate = new Date(sent.export.cuttingDate);
      if (cuttingDate < weekStart || cuttingDate > weekEnd) return false;
      if (
        selectedProducer &&
        sent.export.merchant?.businessName !== selectedProducer
      ) {
        return false;
      }
      if (selectedBoxBrand && sent.export.boxBrand?.name !== selectedBoxBrand) {
        return false;
      }
      if (
        selectedClient &&
        sent.export.client?.businessName !== selectedClient
      ) {
        return false;
      }
      return true;
    });
  }, [
    exportSentData,
    weekStart,
    weekEnd,
    selectedProducer,
    selectedBoxBrand,
    selectedClient,
  ]);

  const farmsSummary = useMemo(() => {
    const grouped: Record<
      string,
      {
        producer: string;
        farm: string;
        processes: {
          quantity: number;
          color: string;
          brand: string;
          weight: number;
        }[];
        totalBoxes: number;
      }
    > = {};

    filteredData.forEach((sent) => {
      const exp = sent.export;
      if (!exp || !exp.business || !exp.cuttingDate) return;

      const farmId = exp.business.id;
      const key = `farm-${farmId}`;

      const quantity = exp.weekTotal || exp.boxQuantity || 0;
      const color = getExportColor(exp.id);
      const brand = exp.boxBrand?.name || 'Sin marca';
      const weight = exp.boxBrand?.grossWeightBox || 0;

      if (!grouped[key]) {
        grouped[key] = {
          producer: exp.merchant?.businessName || 'Sin productor',
          farm: exp.business.name,
          processes: [],
          totalBoxes: 0,
        };
      }

      grouped[key].processes.push({ quantity, color, brand, weight });
      grouped[key].totalBoxes += quantity;
    });

    return Object.values(grouped);
  }, [filteredData, getExportColor]);

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

  if (farmsSummary.length === 0) {
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
        {farmsSummary.map((item, idx) => (
          <Flex
            key={idx}
            direction='column'
            gap={2}
            p={3}
            borderWidth='1px'
            borderRadius='l2'
          >
            <Box>
              <Text fontSize='sm' fontWeight='semibold'>
                {item.farm}
              </Text>
              <Text fontSize='xs' color='fg.muted'>
                {item.producer}
              </Text>
            </Box>
            <VStack align='stretch' gap={1}>
              {item.processes.map((proc, index) => (
                <Flex key={index} align='center' gap={2}>
                  <Box
                    boxSize={2}
                    flexShrink={0}
                    borderRadius='full'
                    bg={proc.color}
                  />
                  <Text fontSize='xs'>
                    {proc.quantity} cajas · {proc.brand} · {proc.weight} lb
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
                {item.totalBoxes} cajas
              </Text>
            </Flex>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};
