'use client';
import {
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Text,
  Separator,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdLocalShipping } from 'react-icons/md';
import ExportFromLine from '@/components/purchase-order/ExportFromLine';
import IsOnboarding from '@/components/ui/IsOnboarding';
import LoadingState from '@/components/ui/states/LoadingState';
import { usePurchaseOrder } from '@/hooks/purchase-order/getPurchaseOrder';
import { PurchaseOrderResponse } from '@/types/purchaseOrder';
import { getWeekInfo } from '@/utils/getWeekInfo';

function ExportFromLinePage(): React.JSX.Element {
  const { id, lineId } = useParams<{ id: string; lineId: string }>();
  const { data, isLoading } = usePurchaseOrder(id);
  const order = data as PurchaseOrderResponse | undefined;
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='sm'
          overflow='hidden'
          borderWidth='1px'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <Card.Header bg={'bg.subtle'} pb={4}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
                <Icon boxSize={5} asChild>
                  <MdLocalShipping />
                </Icon>
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
          </Card.Header>

          <Separator />

          <Card.Body>
            {isLoading || !order ? (
              <LoadingState />
            ) : (
              <ExportFromLine order={order} lineId={Number(lineId)} />
            )}
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ExportFromLinePage);
