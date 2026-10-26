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
import LoadingState from '@/components/ui/states/LoadingState';
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
    clientId: number;
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

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError || !sentData) {
    return <div>Error al cargar los datos</div>;
  }

  if (filteredSentData.length === 0) {
    return (
      <Box>
        <Text fontSize='xl'>
          Aún no se han incluido exportaciones para la semana seleccionada.
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
        label: `${boxBrand.name} \n (Prod: ${merchantId} - Cli: ${clientId})`,
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
    const [brandLine, producerLine, clientLine] = String(payload.value).split(
      '\n'
    );

    const brandLines = splitTextByLength(brandLine, 14);

    const lines = [...brandLines, producerLine, clientLine];

    return (
      <g transform={`translate(${x},${y})`}>
        <text textAnchor='middle' fontSize={10}>
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
    <Box width='100%' height='400px'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id='gradientCliente' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#5aca74' stopOpacity={0.8} />
              <stop offset='100%' stopColor='#5aca74' stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id='gradientProductor' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#755ebc' stopOpacity={0.8} />
              <stop offset='100%' stopColor='#755ebc' stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='label'
            tick={<CustomTick />}
            interval={0}
            height={80}
            tickMargin={10}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey='clientTotal'
            name='Cliente'
            fill='url(#gradientCliente)'
          />
          <Bar
            dataKey='producerTotal'
            name='Productor'
            fill='url(#gradientProductor)'
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
