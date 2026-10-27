import {
  Badge,
  Box,
  Flex,
  HStack,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useBookingDocumentStatus } from '../../hooks/booking/documentStatus';
import { BookingDocumentStatus } from '../../types/shipmentStatus';
import { CHECKLIST_STATUS, SEMAPHORE_COLOR } from '../../utils/shipmentStatus';
import { useColorModeValue } from '../ui/color-mode';

export default function BookingDocumentChecklist({
  bookingId,
}: {
  bookingId: number;
}): React.JSX.Element | null {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { data } = useBookingDocumentStatus(bookingId);
  const status = data as BookingDocumentStatus | undefined;
  if (!status) return null;
  const done = status.items.length - status.missing.length;

  return (
    <Box border='1px solid' borderColor={borderColor} borderRadius='md' p={4}>
      <Flex justify='space-between' align='center' gap={4} wrap='wrap'>
        <HStack gap={3}>
          <Badge
            colorPalette={SEMAPHORE_COLOR[status.semaphore]}
            fontSize='sm'
            px={2}
          >
            {status.statusLabel}
          </Badge>
          <Text fontSize='sm' color='gray.600'>
            {done} de {status.items.length} listos
          </Text>
        </HStack>
        <Box flex='1' minW='160px' maxW='320px'>
          <Progress.Root
            value={status.progress}
            colorPalette={SEMAPHORE_COLOR[status.semaphore]}
            size='sm'
            borderRadius='md'
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </Box>
      </Flex>
      <Text fontSize='xs' color='gray.500' mt={2}>
        Se bloquea con algo rechazado, o con algo pendiente a 24 horas del
        zarpe. No impide guardar nada.
      </Text>
      <VStack align='stretch' gap={2} mt={3}>
        {status.items.map((item) => (
          <Flex
            key={`${item.document}-${item.scope}`}
            gap={3}
            align='flex-start'
          >
            <Badge
              colorPalette={CHECKLIST_STATUS[item.status].colorScheme}
              minW='80px'
              textAlign='center'
            >
              {CHECKLIST_STATUS[item.status].label}
            </Badge>
            <Box>
              <Text fontSize='sm' fontWeight='semibold'>
                {item.document}{' '}
                <Text as='span' fontWeight='normal' color='gray.600'>
                  · {item.scope}
                </Text>
              </Text>
              {item.detail && (
                <Text fontSize='sm' color='gray.600'>
                  {item.detail}
                </Text>
              )}
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}
