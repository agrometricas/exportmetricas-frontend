'use client';

import { Box, Table, Text, Icon, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { MdArrowDropDown, MdArrowDropUp, MdDragHandle } from 'react-icons/md';
import { useSpotPrices } from '../../hooks/utils/getSpotPrices';

interface ExportSent {
  id: number;
  export: {
    id: number;
    boxBrand: {
      id: number;
      name: string;
    };
    merchantId: number;
    merchant: {
      businessName: string;
      businessId: string;
      city: { id: number; name: string; code: string; provinceId: number };
      address: string;
    };
    clientId: number;
    cuttingDate: string;
    contractType: string;
  };
  producerPayment?: {
    merchantId: number;
    boxQuantity: number;
    price: string;
  } | null;
  clientPayment?: {
    clientId: number;
    boxQuantity: number;
  } | null;
}

type Props = {
  exportSentData: ExportSent[];
};

export function SpotPriceComparison({ exportSentData }: Props): JSX.Element {
  const { data: spotPrices } = useSpotPrices();

  const recentSpotPrices = spotPrices?.slice(0, 10) || [];

  const lastSpotPrice = recentSpotPrices.length
    ? Number(recentSpotPrices[0].price)
    : 0;

  const groupedByProducer = exportSentData
    .filter((exp) => exp.export?.contractType === 'SPOT')
    .reduce(
      (acc, sent) => {
        const producerName = sent.export?.merchant?.businessName;
        const boxQuantity = Number(sent.producerPayment?.boxQuantity || 0);
        const price = Number(sent.producerPayment?.price || 0);

        if (!producerName || !boxQuantity || !price) return acc;

        if (!acc[producerName]) {
          acc[producerName] = { totalBoxes: 0, totalAmount: 0 };
        }

        acc[producerName].totalBoxes += boxQuantity;
        acc[producerName].totalAmount += price * boxQuantity;

        return acc;
      },
      {} as Record<string, { totalBoxes: number; totalAmount: number }>
    );

  const producerAverages = Object.entries(groupedByProducer).map(
    ([producer, { totalBoxes, totalAmount }]) => ({
      producer,
      averagePrice: totalBoxes > 0 ? totalAmount / totalBoxes : 0,
    })
  );

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
                <Table.Cell>
                  {format(
                    new Date(
                      new Date(price.date).getTime() + 5 * 60 * 60 * 1000
                    ),
                    'dd/MM/yyyy'
                  )}
                </Table.Cell>
                <Table.Cell textAlign='end'>
                  ${Number(price.price).toFixed(2)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      <Box>
        <Text as='h3' textStyle='h3' color='fg.heading' mb={3}>
          Precio SPOT por productor
        </Text>
        <Table.Root size='sm' variant='line'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Productor</Table.ColumnHeader>
              <Table.ColumnHeader textAlign='end'>Promedio</Table.ColumnHeader>
              <Table.ColumnHeader textAlign='center'>
                Tendencia
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {producerAverages.map(({ producer, averagePrice }) => {
              const diff = averagePrice - lastSpotPrice;
              const isEqual = Math.abs(diff) < 0.01;
              const isAbove = diff > 0;

              let IconComponent = MdDragHandle;
              let iconColor = 'yellow.fg';

              if (!isEqual) {
                IconComponent = isAbove ? MdArrowDropUp : MdArrowDropDown;
                iconColor = isAbove ? 'green.fg' : 'red.fg';
              }

              return (
                <Table.Row key={producer}>
                  <Table.Cell>{producer}</Table.Cell>
                  <Table.Cell textAlign='end'>
                    ${averagePrice.toFixed(2)}
                  </Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Icon color={iconColor} fontSize='xl' asChild>
                      <IconComponent />
                    </Icon>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>
    </VStack>
  );
}
