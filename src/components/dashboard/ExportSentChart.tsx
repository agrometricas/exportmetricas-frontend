'use client';

import { Box, Text } from '@chakra-ui/react';
import React from 'react';
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
import { CHART_SERIES } from '@/theme/chartColors';
import { PaymentBoxes } from '@/types/weekSummary';

interface ExportSentChartProps {
  payments: PaymentBoxes[];
}

export function ExportSentChart({
  payments,
}: ExportSentChartProps): React.JSX.Element {
  const title = (
    <Text as='h3' textStyle='h3' color='fg.heading' mb={4}>
      Cajas cobradas y pagadas
    </Text>
  );

  if (payments.length === 0) {
    return (
      <Box>
        {title}
        <Text fontSize='sm' color='fg.muted'>
          Aún no hay envíos de insumos para la semana seleccionada.
        </Text>
      </Box>
    );
  }

  const chartData = payments.map((payment) => ({
    label: [payment.boxBrand.name, payment.merchant.name, payment.client.name]
      .filter(Boolean)
      .join('\n'),
    clientTotal: payment.clientBoxes,
    producerTotal: payment.producerBoxes,
  }));

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
