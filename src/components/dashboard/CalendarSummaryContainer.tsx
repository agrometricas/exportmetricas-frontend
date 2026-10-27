/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Card,
  Grid,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
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
import ErrorState from '@/components/ui/states/ErrorState';
import { ExportResponse } from '@/types/export.response';
import { formatUsd } from '@/utils/costBatch';
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

function SummaryCard({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Card.Root boxShadow='sm'>
      <Card.Body p={5}>{children}</Card.Body>
    </Card.Root>
  );
}

function WeekStat({
  label,
  value,
  help,
}: {
  label: string;
  value: string;
  help: string;
}): React.JSX.Element {
  return (
    <SummaryCard>
      <Stat.Root>
        <Stat.Label>{label}</Stat.Label>
        <Stat.ValueText textStyle='h2' fontVariantNumeric='tabular-nums'>
          {value}
        </Stat.ValueText>
        <Stat.HelpText>{help}</Stat.HelpText>
      </Stat.Root>
    </SummaryCard>
  );
}

export default function CalendarSummaryContainer(): JSX.Element {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedProducer, setSelectedProducer] = useState<string>('');
  const [selectedBoxBrand, setSelectedBoxBrand] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');

  const { data, isLoading, isError, error, refetch } = useExports({
    search: '',
    page: 1,
    limit: 100,
  });

  const {
    data: sentData,
    isLoading: isLoadingSent,
    isError: isErrorSent,
    error: errorSent,
    refetch: refetchSent,
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
      format(addDays(weekStart, i), 'EEE d', { locale: es })
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
      <Grid
        templateColumns={{ base: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' }}
        gap={4}
      >
        <Skeleton height='360px' borderRadius='l3' />
        <Skeleton height='360px' borderRadius='l3' />
        <Skeleton height='280px' borderRadius='l3' />
        <Skeleton height='280px' borderRadius='l3' />
      </Grid>
    );
  }
  if (isError || isErrorSent || !data || !sentData) {
    return (
      <SummaryCard>
        <ErrorState
          error={error ?? errorSent}
          title='No se pudo cargar la semana'
          onRetry={() => {
            refetch();
            refetchSent();
          }}
        />
      </SummaryCard>
    );
  }

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' }}
      gap={4}
      alignItems='start'
    >
      <Stack gap={4}>
        <SummaryCard>
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
        </SummaryCard>
        <SummaryCard>
          <WeeklyFarmSummaryCard
            exportSentData={filteredExportSent}
            weekStart={weekStart}
            weekEnd={weekEnd}
            getExportColor={getExportColor}
            selectedProducer={selectedProducer}
            selectedBoxBrand={selectedBoxBrand}
            selectedClient={selectedClient}
          />
        </SummaryCard>
        <SummaryCard>
          <ExportSentChart weekStart={weekStart} weekEnd={weekEnd} />
        </SummaryCard>
      </Stack>
      <Stack gap={4}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 1 }} gap={4}>
          <WeekStat
            label='Egreso de la semana'
            value={formatUsd(totalEgreso)}
            help='Pagos a productores'
          />
          <WeekStat
            label='Ingreso de la semana'
            value={formatUsd(totalIngreso)}
            help='Cobros a clientes'
          />
        </SimpleGrid>
        <SummaryCard>
          <WeeklyExportsSummary
            filteredData={filteredData}
            getExportColor={getExportColor}
          />
        </SummaryCard>
        <SummaryCard>
          <SpotPriceComparison exportSentData={filteredExportSent} />
        </SummaryCard>
      </Stack>
    </Grid>
  );
}
