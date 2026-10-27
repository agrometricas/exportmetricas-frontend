'use client';

import {
  Card,
  Grid,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
} from '@chakra-ui/react';
import { startOfWeek, endOfWeek, isSameWeek } from 'date-fns';
import React, { useState, useMemo, useRef } from 'react';
import ErrorState from '@/components/ui/states/ErrorState';
import { useWeekSummary } from '@/hooks/reports/weekSummary';
import { Party, WeekSummaryExport } from '@/types/weekSummary';
import { formatUsd } from '@/utils/costBatch';
import { ExportSentChart } from './ExportSentChart';
import { SpotPriceComparison } from './SpotPriceComparison';
import WeeklyExportsCalendar from './WeeklyExportsCalendar';
import WeeklyExportsSummary from './WeeklyExportsSummary';
import { WeeklyFarmSummaryCard } from './WeeklyFarmSummaryCard';

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
  const [producer, setProducer] = useState<Party | null>(null);
  const [boxBrand, setBoxBrand] = useState<Party | null>(null);
  const [client, setClient] = useState<Party | null>(null);

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

  const { summary, isLoading, isPlaceholderData, isError, error, refetch } =
    useWeekSummary(weekStart.toISOString(), {
      merchantId: producer?.id,
      boxBrandId: boxBrand?.id,
      clientId: client?.id,
    });

  const exportsById = useMemo(
    () =>
      new Map<number, WeekSummaryExport>(
        (summary?.exports ?? []).map((exp) => [exp.id, exp])
      ),
    [summary]
  );

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

  if (isLoading) {
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
  if (isError || !summary) {
    return (
      <SummaryCard>
        <ErrorState
          error={error}
          title='No se pudo cargar la semana'
          onRetry={refetch}
        />
      </SummaryCard>
    );
  }

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' }}
      gap={4}
      alignItems='start'
      aria-busy={isPlaceholderData}
      opacity={isPlaceholderData ? 0.6 : 1}
      transition='opacity 150ms'
    >
      <Stack gap={4}>
        <SummaryCard>
          <WeeklyExportsCalendar
            setCurrentDate={setCurrentDate}
            isCurrentWeek={isCurrentWeek}
            weekStart={weekStart}
            weekEnd={weekEnd}
            filters={summary.filters}
            producer={producer}
            setProducer={setProducer}
            boxBrand={boxBrand}
            setBoxBrand={setBoxBrand}
            client={client}
            setClient={setClient}
            days={summary.days}
            exportsById={exportsById}
            getExportColor={getExportColor}
          />
        </SummaryCard>
        <SummaryCard>
          <WeeklyFarmSummaryCard
            farms={summary.farms}
            weekStart={weekStart}
            weekEnd={weekEnd}
            getExportColor={getExportColor}
          />
        </SummaryCard>
        <SummaryCard>
          <ExportSentChart payments={summary.payments} />
        </SummaryCard>
      </Stack>
      <Stack gap={4}>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 1 }} gap={4}>
          <WeekStat
            label='Egreso de la semana'
            value={formatUsd(Number(summary.totals.producerPaid))}
            help='Pagos a productores'
          />
          <WeekStat
            label='Ingreso de la semana'
            value={formatUsd(Number(summary.totals.clientCollected))}
            help='Cobros a clientes'
          />
        </SimpleGrid>
        <SummaryCard>
          <WeeklyExportsSummary
            exports={summary.exports}
            totals={summary.totals}
            getExportColor={getExportColor}
          />
        </SummaryCard>
        <SummaryCard>
          <SpotPriceComparison spot={summary.spot} />
        </SummaryCard>
      </Stack>
    </Grid>
  );
}
