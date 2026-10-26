'use client';

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ExportType } from '../../types/export';
import { formatDayMonthYear } from '../../utils/dayMonthYear';

interface ExportCardProps {
  exportItem: Partial<ExportType>;
  pathname: string;
  isSelected?: boolean;
  onToggleSelected?: () => void;
}

const LabelValue = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}): React.JSX.Element => {
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const valueColor = useColorModeValue('gray.800', 'gray.100');
  return (
    <HStack align="start" spacing={2}>
      <Text fontSize="sm" color={labelColor} minW="120px">
        {label}:
      </Text>
      <Text fontSize="sm" color={valueColor} fontWeight="medium" flex="1" noOfLines={2}>
        {value ?? '—'}
      </Text>
    </HStack>
  );
};

const ExportCard: React.FC<ExportCardProps> = ({
  exportItem,
  pathname,
  isSelected = false,
  onToggleSelected,
}) => {
  const router = useRouter();

  const handleClick = (): void => {
    router.push(`${pathname}/${exportItem.id}`);
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const titleColor = useColorModeValue('gray.900', 'gray.100');
  const subColor = useColorModeValue('gray.600', 'gray.300');

  const typeOfBox =
    exportItem.boxBrand?.brand?.name && exportItem.boxBrand?.name
      ? `${exportItem.boxBrand.brand.name} — ${exportItem.boxBrand.name}`
      : exportItem.boxBrand?.name || exportItem.boxBrand?.brand?.name;

  const producer = exportItem.merchant?.businessName;
  const farm = exportItem.business?.name;
  const harborDep = exportItem.harborDeparture?.name;
  const harborDest = exportItem.harborDestination?.name;
  const client = exportItem.client?.businessName;
  const totalBoxes = exportItem.boxQuantity;
  const cuttingDate = formatDayMonthYear(exportItem.cuttingDate) || undefined;

  return (
    <>
      <Card
        bg={cardBg}
        border="1px solid"
        borderColor={isSelected ? 'green.400' : borderColor}
        borderRadius="xl"
        boxShadow="md"
        overflow="hidden"
        borderTopWidth="4px"
        borderTopColor="green.500"
        h="100%"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
        transition="all 0.2s ease"
      >
        <CardHeader pb={3}>
          <HStack spacing={3} align="center" justify="space-between">
            <VStack spacing={0} align="start">
              <Heading size="md" color={titleColor}>
                Envío pendiente
              </Heading>
              <HStack spacing={2} mt={1} flexWrap="wrap">
                {!!totalBoxes && (
                  <Badge variant="subtle" colorScheme="green" borderRadius="full" px={3} py={1} fontSize="xs">
                    {totalBoxes} cajas
                  </Badge>
                )}
              </HStack>
            </VStack>
            {onToggleSelected && (
              <Checkbox
                isChecked={isSelected}
                onChange={onToggleSelected}
                colorScheme="green"
              >
                <Text fontSize="sm">Elegir</Text>
              </Checkbox>
            )}
          </HStack>
        </CardHeader>

        <CardBody pt={0}>
          <VStack spacing={3} align="stretch">
            <Divider />
            <Stack spacing={3}>
              <LabelValue label="Fecha de Corte" value={cuttingDate} />
              <LabelValue label="Tipo de Caja" value={typeOfBox} />
              <LabelValue label="Productor" value={producer} />
              <LabelValue label="Finca" value={farm} />
              <LabelValue label="Puerto Salida" value={harborDep} />
              <LabelValue label="Puerto Destino" value={harborDest} />
              <LabelValue label="Cliente" value={client} />
            </Stack>

            {exportItem.business?.contacts?.length ? (
              <VStack align="stretch" spacing={2} pt={1}>
                <Text fontSize="sm" color={subColor} fontWeight="semibold">
                  Contactos de Finca
                </Text>
                <VStack align="stretch" spacing={1}>
                  {exportItem.business.contacts.map((c) => (
                    <Text key={c.id} fontSize="sm" color={subColor}>
                      {c.name} — {c.phone}
                    </Text>
                  ))}
                </VStack>
              </VStack>
            ) : null}
          </VStack>
        </CardBody>

        <CardFooter pt={0}>
          <Button
            w="100%"
            colorScheme="green"
            onClick={handleClick}
            borderRadius="lg"
            fontWeight="semibold"
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
            transition="all 0.2s ease"
          >
            Realizar envío
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default ExportCard;
