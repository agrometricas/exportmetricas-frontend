'use client';

import { Box, Text } from '@chakra-ui/react';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Text as SvgText,
} from 'recharts';
import { CHART_SERIES } from '@/theme/chartColors';
import { PaymentBoxes } from '@/types/weekSummary';

interface ExportSentChartProps {
  payments: PaymentBoxes[];
}

interface CategoryTickProps {
  x: number;
  y: number;
  payload: { value: string };
}

// Below this width per category the three-line labels collide, so the chart
// turns into one row per category with its label above the bars.
const MIN_COLUMN_WIDTH = 160;

const COLUMNS_HEIGHT = 400;
const COLUMNS_MARGIN = { top: 8, right: 8, left: 0, bottom: 8 };
const VALUE_AXIS_WIDTH = 48;
const COLUMN_LABEL_GAP = 8;

const ROW_HEIGHT = 120;
const ROW_BAR_SIZE = 14;
const BAR_GAP = 2;
const ROW_LABEL_GAP = 4;
// Each label sits above its bars, past the top of its band: the top margin
// leaves room for the first one. The right one fits the last value tick.
const ROWS_MARGIN = { top: 12, right: 24, left: 0, bottom: 8 };
// The value axis plus the legend, which wraps onto two lines on a phone.
const ROWS_AXIS_AND_LEGEND_HEIGHT = 78;

const LINE_HEIGHT = 16;
// Recharts measures with these styles on a span through the CSSOM, which drops
// a unitless font size: it has to carry its unit.
const LABEL_STYLE = { fontSize: '12px' };
const PRIMARY_LABEL_STYLE = { fontSize: '12px', fontWeight: 600 };

function labelLines(label: string): string[] {
  return label.split('\n');
}

function CategoryLabel({
  x,
  y,
  label,
  width,
  textAnchor,
}: {
  x: number;
  y: number;
  label: string;
  width: number;
  textAnchor: 'start' | 'middle';
}): React.JSX.Element {
  return (
    <g transform={`translate(${x},${y})`}>
      {labelLines(label).map((line, index) => (
        <SvgText
          key={index}
          y={index * LINE_HEIGHT}
          width={width}
          maxLines={1}
          textAnchor={textAnchor}
          verticalAnchor='start'
          style={index === 0 ? PRIMARY_LABEL_STYLE : LABEL_STYLE}
          className={index === 0 ? 'chart-category-primary' : undefined}
        >
          {line}
        </SvgText>
      ))}
    </g>
  );
}

function TooltipLabel({ label }: { label: string }): React.JSX.Element {
  return (
    <>
      {labelLines(label).map((line, index) => (
        <Text
          as='span'
          key={index}
          display='block'
          fontWeight={index === 0 ? 'semibold' : 'normal'}
          color={index === 0 ? 'fg' : 'fg.muted'}
        >
          {line}
        </Text>
      ))}
    </>
  );
}

export function ExportSentChart({
  payments,
}: ExportSentChartProps): React.JSX.Element {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number | null>(null);
  const hasPayments = payments.length > 0;

  // The layout and the label widths depend on the width, so it is read before
  // the first paint instead of waiting for the observer's first callback.
  useLayoutEffect(() => {
    const element = chartRef.current;
    if (!element) return;
    setChartWidth(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) =>
      setChartWidth(entry.contentRect.width)
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasPayments]);

  const title = (
    <Text as='h3' textStyle='h3' color='fg.heading' mb={4}>
      Cajas cobradas y pagadas
    </Text>
  );

  if (!hasPayments) {
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

  const columnsPlotWidth =
    (chartWidth ?? 0) -
    COLUMNS_MARGIN.left -
    COLUMNS_MARGIN.right -
    VALUE_AXIS_WIDTH;
  const columnWidth = columnsPlotWidth / chartData.length;
  const asRows = chartWidth !== null && columnWidth < MIN_COLUMN_WIDTH;
  const plotWidth = asRows
    ? (chartWidth ?? 0) - ROWS_MARGIN.left - ROWS_MARGIN.right
    : columnsPlotWidth;
  const height = asRows
    ? chartData.length * ROW_HEIGHT +
      ROWS_MARGIN.top +
      ROWS_MARGIN.bottom +
      ROWS_AXIS_AND_LEGEND_HEIGHT
    : COLUMNS_HEIGHT;

  const renderColumnLabel = ({
    x,
    y,
    payload,
  }: CategoryTickProps): React.JSX.Element => (
    <CategoryLabel
      x={x}
      y={y}
      label={payload.value}
      width={columnWidth - COLUMN_LABEL_GAP}
      textAnchor='middle'
    />
  );

  const renderRowLabel = ({
    x,
    y,
    payload,
  }: CategoryTickProps): React.JSX.Element => {
    const barsTop = y - ROW_BAR_SIZE - BAR_GAP / 2;
    const labelHeight = labelLines(payload.value).length * LINE_HEIGHT;
    return (
      <CategoryLabel
        x={x}
        y={barsTop - ROW_LABEL_GAP - labelHeight}
        label={payload.value}
        width={plotWidth}
        textAnchor='start'
      />
    );
  };

  return (
    <Box>
      {title}
      <Box
        ref={chartRef}
        width='100%'
        height={`${height}px`}
        css={{
          // The chart gets this box's width in pixels; without containment that
          // width would hold the card open when the window narrows.
          contain: 'inline-size',
          // Recharts paints with SVG attributes; CSS wins over them, so the
          // axes and the grid follow the color mode.
          '& .recharts-cartesian-axis-tick-value, & .recharts-cartesian-axis-tick text':
            { fill: 'fg.muted' },
          '& .recharts-cartesian-axis-tick .chart-category-primary': {
            fill: 'fg',
          },
          // Row labels sit on top of the grid: a halo in the card's color keeps
          // the lines from crossing the text.
          '& .recharts-yAxis .recharts-cartesian-axis-tick text': {
            paintOrder: 'stroke',
            stroke: 'bg.panel',
            strokeWidth: '4px',
            strokeLinejoin: 'round',
          },
          '& .recharts-cartesian-grid line, & .recharts-cartesian-axis-line': {
            stroke: 'border',
          },
          '& .recharts-legend-item-text': { color: 'fg !important' },
          '& .recharts-tooltip-cursor': { fill: 'bg.muted' },
        }}
      >
        {chartWidth !== null && (
          <BarChart
            width={chartWidth}
            height={height}
            data={chartData}
            layout={asRows ? 'vertical' : 'horizontal'}
            margin={asRows ? ROWS_MARGIN : COLUMNS_MARGIN}
            barGap={BAR_GAP}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={asRows}
              horizontal={!asRows}
            />
            {asRows ? (
              <XAxis type='number' tickLine={false} axisLine={false} />
            ) : (
              <XAxis
                dataKey='label'
                tick={renderColumnLabel}
                interval={0}
                height={64}
                tickMargin={4}
                tickLine={false}
              />
            )}
            {asRows ? (
              <YAxis
                type='category'
                dataKey='label'
                tick={renderRowLabel}
                interval={0}
                mirror
                tickSize={0}
                tickMargin={0}
                tickLine={false}
                axisLine={false}
              />
            ) : (
              <YAxis
                tickLine={false}
                axisLine={false}
                width={VALUE_AXIS_WIDTH}
              />
            )}
            <Tooltip
              // The band highlight would cut through the row labels, which sit
              // above their band.
              cursor={!asRows}
              wrapperStyle={{ maxWidth: plotWidth }}
              contentStyle={{
                background: 'var(--chakra-colors-bg-panel)',
                border: '1px solid var(--chakra-colors-border)',
                borderRadius: 10,
                color: 'var(--chakra-colors-fg)',
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
              }}
              labelFormatter={(label) => <TooltipLabel label={String(label)} />}
            />
            <Legend />
            <Bar
              dataKey='clientTotal'
              name='Cobro al cliente'
              fill={CHART_SERIES[0]}
              radius={asRows ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              barSize={asRows ? ROW_BAR_SIZE : undefined}
              maxBarSize={32}
            />
            <Bar
              dataKey='producerTotal'
              name='Pago al productor'
              fill={CHART_SERIES[1]}
              radius={asRows ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              barSize={asRows ? ROW_BAR_SIZE : undefined}
              maxBarSize={32}
            />
          </BarChart>
        )}
      </Box>
    </Box>
  );
}
