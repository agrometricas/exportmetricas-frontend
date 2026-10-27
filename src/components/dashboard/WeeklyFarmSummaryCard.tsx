import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  HStack,
  Button,
  Separator,
} from '@chakra-ui/react';
import { AxiosResponse, AxiosError } from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { BiDownload } from 'react-icons/bi';
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
      console.error('Error al descargar el reporte:', error);
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

  if (farmsSummary.length === 0) {
    return (
      <Box p={4}>
        <Text fontSize='xl'>
          Aún no se han incluido exportaciones para la semana seleccionada.
        </Text>
      </Box>
    );
  }

  return (
    <Box height='100%'>
      <HStack width='100%' justify='space-between' align='center' mb={2}>
        <Text fontSize='xl' fontWeight='bold'>
          Exportaciones por Finca
        </Text>
        <Button
          size='sm'
          onClick={() => downloadReport(weekStart.toISOString())}
        >
          <BiDownload />
          Descargar Reporte
        </Button>
      </HStack>

      <Separator
        mb={6}
        borderTopWidth='2px'
        borderBottomWidth='0px'
        borderStyle='dashed'
        borderColor='green.solid'
      />
      <Grid templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }} gap={4}>
        {farmsSummary.map((item, idx) => (
          <GridItem
            key={idx}
            borderWidth='1px'
            borderColor='border'
            boxShadow='sm'
            borderRadius='md'
            p={4}
            height='100%'
          >
            <VStack align='start' gap={2} h={'100%'}>
              <Text fontSize='md' fontWeight='bold'>
                {item.farm}
              </Text>
              <Text fontSize='sm' color='fg.muted'>
                <strong>{item.producer}</strong>
              </Text>
              <VStack align='start' gap={1}>
                {item.processes.map((proc, index) => (
                  <HStack key={index} gap={2}>
                    <Box
                      minWidth='5px'
                      height='90%'
                      borderRadius='full'
                      bg={proc.color}
                    />
                    <Text fontSize='sm'>
                      Envió {proc.quantity} {proc.brand} - {proc.weight}lbs
                    </Text>
                  </HStack>
                ))}
              </VStack>
              <Text mt='auto' textAlign='center' w='100%' fontSize={'md'}>
                <strong>Cajas Totales:</strong> {item.totalBoxes}
              </Text>{' '}
            </VStack>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};
