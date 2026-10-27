'use client';

import { Box, Text } from '@chakra-ui/react';
import { parseISO } from 'date-fns';
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import { CHART_SERIES } from '@/theme/chartColors';
import { useExportsSent } from '../../hooks/export/getExportSents';

interface ExportSent {
  id: number;
  export: {
    id: number;
    boxBrand: {
      id: number;
      name: string;
    };
    merchantId: number;
    merchant?: { businessName: string } | null;
    clientId: number;
    client?: { businessName: string } | null;
    cuttingDate: string;
  };
  producerPayment?: {
    merchantId: number;
    boxQuantity: number;
  } | null;
  clientPayment?: {
    clientId: number;
    boxQuantity: number;
  } | null;
}

interface ChartData {
  groupKey: string;
  label: string;
  producerTotal: number;
  clientTotal: number;
}

interface ExportSentChartProps {
  weekStart: Date;
  weekEnd: Date;
}

export function ExportSentChart({
  weekStart,
  weekEnd,
}: ExportSentChartProps): React.JSX.Element {
  const {
    data: sentData,
    isLoading,
    isError,
    error,
    refetch,
  } = useExportsSent({
    search: '',
    page: 1,
    limit: 100,
  });

  const filteredSentData: ExportSent[] = useMemo(() => {
    return sentData.filter((sent: ExportSent) => {
      if (!sent.export?.cuttingDate) return false;
      try {
        const date = parseISO(sent.export.cuttingDate);
        return date >= weekStart && date <= weekEnd;
      } catch (error) {
        return false;
      }
    });
  }, [sentData, weekStart, weekEnd]);

  const title = (
    <Text as='h3' textStyle='h3' color='fg.heading' mb={4}>
      Cajas cobradas y pagadas
    </Text>
  );

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !sentData) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (filteredSentData.length === 0) {
    return (
      <Box>
        {title}
        <Text fontSize='sm' color='fg.muted'>
          Aún no hay envíos de insumos para la semana seleccionada.
        </Text>
      </Box>
    );
  }

  const groupedData: { [key: string]: ChartData } = {};

  filteredSentData.forEach((item: ExportSent) => {
    const boxBrand = item.export.boxBrand;
    const merchantId = item.export?.merchantId ?? 'sinProd';
    const clientId = item.export?.clientId ?? 'sinCli';

    const groupKey = `${boxBrand.id}_${merchantId}_${clientId}`;

    if (!groupedData[groupKey]) {
      groupedData[groupKey] = {
        groupKey,
        label: [
          boxBrand.name,
          item.export.merchant?.businessName,
          item.export.client?.businessName,
        ]
          .filter(Boolean)
          .join('\n'),
        producerTotal: 0,
        clientTotal: 0,
      };
    }

    if (item.producerPayment) {
      groupedData[groupKey].producerTotal += Number(
        item.producerPayment.boxQuantity
      );
    }
    if (item.clientPayment) {
      groupedData[groupKey].clientTotal += Number(
        item.clientPayment.boxQuantity
      );
    }
  });

  const chartData: ChartData[] = Object.values(groupedData);

  function splitTextByLength(text: string, maxLineLength: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length > maxLineLength) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += ' ' + word;
      }
    }

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTick = ({ x, y, payload }: any): React.JSX.Element => {
    const [brandLine, ...names] = String(payload.value).split('\n');
    const lines = [...splitTextByLength(brandLine, 18), ...names];

    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor='middle' fontSize={11}>
          {lines.map((line, index) => (
            <tspan key={index} x={0} dy={index === 0 ? 0 : 14}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  return (
    <Box>
      {title}
      <Box
        width='100%'
        height='400px'
        css={{
          // Recharts paints with SVG attributes; CSS wins over them, so the
          // axes and the grid follow the color mode.
          '& .recharts-cartesian-axis-tick-value, & .recharts-cartesian-axis-tick text':
            { fill: 'fg.muted' },
          '& .recharts-cartesian-grid line, & .recharts-cartesian-axis-line': {
            stroke: 'border',
          },
          '& .recharts-legend-item-text': { color: 'fg !important' },
          '& .recharts-tooltip-cursor': { fill: 'bg.muted' },
        }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='label'
              tick={<CustomTick />}
              interval={0}
              height={72}
              tickMargin={8}
              tickLine={false}
            />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <Tooltip
              contentStyle={{
                background: 'var(--chakra-colors-bg-panel)',
                border: '1px solid var(--chakra-colors-border)',
                borderRadius: 10,
                color: 'var(--chakra-colors-fg)',
              }}
              labelFormatter={(label) => String(label).split('\n').join(' · ')}
            />
            <Legend />
            <Bar
              dataKey='clientTotal'
              name='Cobro al cliente'
              fill={CHART_SERIES[0]}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey='producerTotal'
              name='Pago al productor'
              fill={CHART_SERIES[1]}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
