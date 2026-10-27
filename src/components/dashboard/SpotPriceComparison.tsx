'use client';

import { Box, Table, Text, Icon, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { IconType } from 'react-icons';
import { MdArrowDropDown, MdArrowDropUp, MdDragHandle } from 'react-icons/md';
import { SpotTrend, SpotWeek } from '@/types/weekSummary';
import { useSpotPrices } from '../../hooks/utils/getSpotPrices';

type Props = {
  spot: SpotWeek;
};

const TRENDS: Record<
  Exclude<SpotTrend, null>,
  { icon: IconType; color: string; label: string }
> = {
  above: { icon: MdArrowDropUp, color: 'green.fg', label: 'Sobre el spot' },
  below: { icon: MdArrowDropDown, color: 'red.fg', label: 'Bajo el spot' },
  equal: { icon: MdDragHandle, color: 'yellow.fg', label: 'Igual al spot' },
};

// Spot prices are dated at UTC midnight; shifted to Ecuador they would fall
// on the previous day.
function spotDay(date: string): string {
  return format(
    new Date(new Date(date).getTime() + 5 * 60 * 60 * 1000),
    'dd/MM/yyyy'
  );
}

export function SpotPriceComparison({ spot }: Props): React.JSX.Element {
  const { data: spotPrices } = useSpotPrices();

  const recentSpotPrices = spotPrices?.slice(0, 10) || [];

  return (
    <VStack align='stretch' gap={6}>
      <Box>
        <Text as='h3' textStyle='h3' color='fg.heading' mb={3}>
          Últimos precios SPOT (Ecuador)
        </Text>
        <Table.Root size='sm' variant='line'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Fecha</Table.ColumnHeader>
              <Table.ColumnHeader textAlign='end'>
                Precio (USD)
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {recentSpotPrices.map((price) => (
              <Table.Row key={price.id}>
                <Table.Cell>{spotDay(price.date)}</Table.Cell>
                <Table.Cell textAlign='end'>
                  ${Number(price.price).toFixed(2)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Box>
        <Text
          as='h3'
          textStyle='h3'
          color='fg.heading'
          mb={spot.reference ? 1 : 3}
        >
          Precio SPOT por productor
        </Text>
        {spot.reference && (
          <Text fontSize='xs' color='fg.muted' mb={3}>
            Frente a ${spot.reference.price} del {spotDay(spot.reference.date)}
          </Text>
        )}
        {spot.producers.length === 0 ? (
          <Text fontSize='sm' color='fg.muted'>
            Aún no hay pagos a productores con contrato SPOT en la semana
            seleccionada.
          </Text>
        ) : (
          <Table.Root size='sm' variant='line'>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Productor</Table.ColumnHeader>
                <Table.ColumnHeader textAlign='end'>
                  Promedio
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign='center'>
                  Tendencia
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {spot.producers.map(({ merchant, averagePrice, trend }) => {
                const shown = trend ? TRENDS[trend] : null;
                return (
                  <Table.Row key={merchant.id}>
                    <Table.Cell>{merchant.name}</Table.Cell>
                    <Table.Cell textAlign='end'>${averagePrice}</Table.Cell>
                    <Table.Cell textAlign='center'>
                      {shown ? (
                        <Icon
                          color={shown.color}
                          fontSize='xl'
                          aria-label={shown.label}
                          asChild
                        >
                          <shown.icon />
                        </Icon>
                      ) : (
                        <Text as='span' color='fg.muted'>
                          —
                        </Text>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </VStack>
  );
}
