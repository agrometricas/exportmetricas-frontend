/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Grid,
  GridItem,
  Text,
  Center,
  Skeleton,
  Separator,
} from '@chakra-ui/react';
import {
  startOfWeek,
  endOfWeek,
  parseISO,
  isSameWeek,
  addDays,
  format,
} from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useMemo, useRef } from 'react';
import { ExportResponse } from '@/types/export.response';
import { ExportSentChart } from './ExportSentChart';
import { SpotPriceComparison } from './SpotPriceComparison';
import WeeklyExportsCalendar from './WeeklyExportsCalendar';
import WeeklyExportsSummary from './WeeklyExportsSummary';
import { WeeklyFarmSummaryCard } from './WeeklyFarmSummaryCard';
import { useExports } from '../../hooks/export/getExports';
import { useExportsSent } from '../../hooks/export/getExportSents';

const colorPalette = [
  '#f87171',
  '#fb923c',
  '#fbbf24',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#0ea5e9',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
];

export default function CalendarSummaryContainer(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedProducer, setSelectedProducer] = useState<string>('');
  const [selectedBoxBrand, setSelectedBoxBrand] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');

  const { data, isLoading, isError } = useExports({
    search: '',
    page: 1,
    limit: 100,
  });

  const {
    data: sentData,
    isLoading: isLoadingSent,
    isError: isErrorSent,
  } = useExportsSent({
    search: '',
    page: 1,
    limit: 100,
  });

  const exportsData = useMemo(
    () => (data ? (data as ExportResponse[]) : []),
    [data]
  );

  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate]
  );
  const weekEnd = useMemo(
    () => endOfWeek(weekStart, { weekStartsOn: 1 }),
    [weekStart]
  );
  const isCurrentWeek = useMemo(
    () => isSameWeek(currentDate, new Date(), { weekStartsOn: 1 }),
    [currentDate]
  );

  const computedDayLabels = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) =>
      format(addDays(weekStart, i), 'EEEE/dd', { locale: es })
    );
  }, [weekStart]);

  const filteredData = useMemo(() => {
    return exportsData.filter((exp) => {
      const expDate = parseISO(exp.cuttingDate);
      if (expDate < weekStart || expDate > weekEnd) return false;
      if (selectedProducer && exp.merchant?.businessName !== selectedProducer)
        return false;
      if (selectedBoxBrand && exp.boxBrand?.name !== selectedBoxBrand)
        return false;
      if (selectedClient && exp.client?.businessName !== selectedClient)
        return false;
      return true;
    });
  }, [
    exportsData,
    weekStart,
    weekEnd,
    selectedProducer,
    selectedBoxBrand,
    selectedClient,
  ]);

  const boxesMatrix = useMemo(() => {
    const matrix: Record<
      number,
      { exportId: number; boxQuantity: number; exportData: ExportResponse }[]
    > = {};
    for (let i = 0; i < 7; i++) {
      matrix[i] = [];
    }
    filteredData.forEach((exp) => {
      if (exp.weekBoxesOfDay) {
        exp.weekBoxesOfDay.forEach((quantity, dayIndex) => {
          if (quantity > 0) {
            matrix[dayIndex].push({
              exportId: exp.id,
              boxQuantity: quantity,
              exportData: exp,
            });
          }
        });
      }
    });
    return matrix;
  }, [filteredData]);

  const exportColorMap = useRef<Record<number, string>>({});
  const colorIndexRef = useRef<number>(0);
  function getExportColor(exportId?: number): string {
    if (!exportId) return '#9CA3AF';
    if (!exportColorMap.current[exportId]) {
      exportColorMap.current[exportId] =
        colorPalette[colorIndexRef.current % colorPalette.length];
      colorIndexRef.current++;
    }
    return exportColorMap.current[exportId];
  }

  const exportSentData = useMemo(() => (sentData ? sentData : []), [sentData]);

  const filteredExportSent = useMemo(() => {
    return exportSentData.filter((sent: any) => {
      if (!sent?.export?.cuttingDate) return false;
      try {
        const cuttingDate = parseISO(sent.export.cuttingDate);
        return cuttingDate >= weekStart && cuttingDate <= weekEnd;
      } catch (error) {
        return false;
      }
    });
  }, [exportSentData, weekStart, weekEnd]);

  const totalEgreso = useMemo(() => {
    return filteredExportSent.reduce((acc: number, sent: any) => {
      if (sent.producerPayment && sent.producerPayment.total) {
        return acc + Number(sent.producerPayment.amount);
      }
      return acc;
    }, 0);
  }, [filteredExportSent]);

  const totalIngreso = useMemo(() => {
    return filteredExportSent.reduce((acc: number, sent: any) => {
      if (sent.clientPayment && sent.clientPayment.total) {
        return acc + Number(sent.clientPayment.total);
      }
      return acc;
    }, 0);
  }, [filteredExportSent]);

  if (isLoading || isLoadingSent) {
    return (
      <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={4}>
        <GridItem>
          <Skeleton height='300px' borderRadius='md' boxShadow='md' p={4} />
        </GridItem>
        <GridItem>
          <Skeleton height='300px' borderRadius='md' boxShadow='md' p={4} />
        </GridItem>
        <GridItem>
          <Skeleton height='300px' borderRadius='md' boxShadow='md' p={4} />
        </GridItem>
        <Grid gap={4}>
          <GridItem>
            <Skeleton height='150px' borderRadius='md' boxShadow='md' p={4} />
          </GridItem>
          <GridItem>
            <Skeleton height='150px' borderRadius='md' boxShadow='md' p={4} />
          </GridItem>
        </Grid>
        <GridItem>
          <Skeleton height='500px' borderRadius='md' boxShadow='md' p={4} />
        </GridItem>
        <GridItem>
          <Skeleton height='500px' borderRadius='md' boxShadow='md' p={4} />
        </GridItem>
      </Grid>
    );
  }
  if (isError || isErrorSent || !data || !sentData) {
    return (
      <Center>
        <Text>Error al cargar exportaciones.</Text>
      </Center>
    );
  }

  return (
    <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={4}>
      <GridItem
        bg='bg.panel'
        p={4}
        borderWidth='1px'
        borderRadius='l3'
        boxShadow='sm'
      >
        <WeeklyExportsCalendar
          setCurrentDate={setCurrentDate}
          isCurrentWeek={isCurrentWeek}
          allData={exportsData}
          selectedProducer={selectedProducer}
          setSelectedProducer={setSelectedProducer}
          selectedBoxBrand={selectedBoxBrand}
          setSelectedBoxBrand={setSelectedBoxBrand}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          weekStart={weekStart}
          weekEnd={weekEnd}
          getExportColor={getExportColor}
          weekDaysOfWeek={computedDayLabels}
          boxesMatrix={boxesMatrix}
        />
      </GridItem>
      <GridItem
        bg='bg.panel'
        p={4}
        borderWidth='1px'
        borderRadius='l3'
        boxShadow='sm'
      >
        <WeeklyExportsSummary
          filteredData={filteredData}
          getExportColor={getExportColor}
        />
      </GridItem>
      <GridItem
        bg='bg.panel'
        p={4}
        borderWidth='1px'
        borderRadius='l3'
        boxShadow='sm'
      >
        <WeeklyFarmSummaryCard
          exportSentData={filteredExportSent}
          weekStart={weekStart}
          weekEnd={weekEnd}
          getExportColor={getExportColor}
          selectedProducer={selectedProducer}
          selectedBoxBrand={selectedBoxBrand}
          selectedClient={selectedClient}
        />
      </GridItem>
      <Grid gap={4}>
        <GridItem
          bg='bg.panel'
          p={6}
          borderWidth='1px'
          borderRadius='l3'
          boxShadow='sm'
        >
          <Text fontSize='xl' fontWeight='normal' mb={2}>
            Egreso Total Semanal
          </Text>
          <Separator
            mb={6}
            borderTopWidth='2px'
            borderBottomWidth='0px'
            borderStyle='dashed'
            borderColor='green.solid'
          />
          <Text fontSize='2xl' fontWeight='semibold'>
            ${totalEgreso} USD
          </Text>
        </GridItem>
        <GridItem
          bg='bg.panel'
          p={6}
          borderWidth='1px'
          borderRadius='l3'
          boxShadow='sm'
        >
          <Text fontSize='xl' mb={2}>
            Ingreso Total Semanal
          </Text>
          <Separator
            mb={6}
            borderTopWidth='2px'
            borderBottomWidth='0px'
            borderStyle='dashed'
            borderColor='green.solid'
          />
          <Text fontSize='2xl' fontWeight='semibold'>
            ${totalIngreso} USD
          </Text>
        </GridItem>
      </Grid>
      <GridItem
        bg='bg.panel'
        p={6}
        borderWidth='1px'
        borderRadius='l3'
        boxShadow='sm'
        mb={4}
      >
        <Text as='h3' textStyle='h3' color='fg.heading' mb={4}>
          Diagrama Cliente/Productor
        </Text>
        <ExportSentChart weekStart={weekStart} weekEnd={weekEnd} />
      </GridItem>
      <GridItem
        bg='bg.panel'
        p={6}
        borderWidth='1px'
        borderRadius='l3'
        boxShadow='sm'
        mb={4}
      >
        <SpotPriceComparison exportSentData={filteredExportSent} />
      </GridItem>
    </Grid>
  );
}
