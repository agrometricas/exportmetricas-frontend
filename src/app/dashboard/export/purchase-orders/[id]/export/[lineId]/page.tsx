'use client';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Icon,
  Text,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdLocalShipping } from 'react-icons/md';
import ExportFromLine from '@/components/purchase-order/ExportFromLine';
import IsOnboarding from '@/components/ui/IsOnboarding';
import { usePurchaseOrder } from '@/hooks/purchase-order/getPurchaseOrder';
import { PurchaseOrderResponse } from '@/types/purchaseOrder';
import { getWeekInfo } from '@/utils/getWeekInfo';

function ExportFromLinePage(): React.JSX.Element {
  const { id, lineId } = useParams<{ id: string; lineId: string }>();
  const { data, isLoading } = usePurchaseOrder(id);
  const order = data as PurchaseOrderResponse | undefined;
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <CardHeader bg={useColorModeValue('gray.50', 'gray.750')} pb={4}>
            <HStack spacing={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
                <Icon as={MdLocalShipping} boxSize={5} />
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Crear Exportación
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  {order
                    ? `De la orden de compra de ${order.merchant.businessName} · ${getWeekInfo({ date: new Date(order.weekStart) }).week}`
                    : 'Cargando la orden'}
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <Divider />

          <CardBody>
            {isLoading || !order ? (
              <Text>Cargando...</Text>
            ) : (
              <ExportFromLine order={order} lineId={Number(lineId)} />
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ExportFromLinePage);
