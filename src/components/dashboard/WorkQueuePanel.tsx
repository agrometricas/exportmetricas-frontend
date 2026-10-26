import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { useWorkQueue } from '../../hooks/export/exportProgress';
import { WorkQueue } from '../../types/exportProgress';
import { formatDayMonthYear } from '../../utils/dayMonthYear';
import { exportPage, stepAction } from '../../utils/exportSteps';
import { missingSummary, SEMAPHORE_COLOR } from '../../utils/shipmentStatus';
import { QUEUE_LIST_PAGE, seesQueue } from '../../utils/workQueueAccess';

const SHOWN = 4;

function GroupCard({
  title,
  count,
  listHref,
  children,
}: {
  title: string;
  count: number;
  listHref: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  return (
    <Card
      bg={cardBg}
      border='1px solid'
      borderColor={borderColor}
      borderRadius='xl'
    >
      <CardBody>
        <Flex justify='space-between' align='center' mb={3}>
          <Heading size='sm'>{title}</Heading>
          <Badge colorScheme='orange' fontSize='sm'>
            {count}
          </Badge>
        </Flex>
        <VStack align='stretch' spacing={3}>
          {children}
        </VStack>
        {count > SHOWN && (
          <Link
            as={Link_Next}
            href={listHref}
            fontSize='sm'
            color='green.600'
            mt={3}
            display='block'
          >
            Ver las {count}
          </Link>
        )}
      </CardBody>
    </Card>
  );
}

export default function WorkQueuePanel({
  role,
}: {
  role: string | undefined;
}): React.JSX.Element | null {
  const { data } = useWorkQueue();
  const queue = data as WorkQueue | undefined;
  if (!queue) return null;

  const groups = queue.groups.filter(
    (group) => group.count > 0 && seesQueue(role, group.key)
  );
  const showDocuments =
    queue.documents.count > 0 && seesQueue(role, 'documents');
  const nothing = groups.length === 0 && !showDocuments;

  return (
    <Box>
      <Heading size='md' mb={3}>
        Lo que falta
      </Heading>
      {nothing ? (
        <Text color='gray.600'>Nada pendiente para tu área. Todo al día.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
          {groups.map((group) => (
            <GroupCard
              key={group.key}
              title={group.label}
              count={group.count}
              listHref={QUEUE_LIST_PAGE[group.key]}
            >
              {group.exports.slice(0, SHOWN).map((item) => {
                const action = stepAction(
                  { key: group.key, status: 'TODO' },
                  { ...item, bookingId: null },
                  '/dashboard'
                );
                return (
                  <Flex
                    key={item.exportId}
                    justify='space-between'
                    align='center'
                    gap={2}
                  >
                    <Box minW={0}>
                      <Link
                        as={Link_Next}
                        href={exportPage(item.exportId)}
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        {item.farm}
                      </Link>
                      <Text fontSize='xs' color='gray.600' noOfLines={1}>
                        {item.client} · {item.boxes} cajas
                        {item.cuttingDate
                          ? ` · corte ${formatDayMonthYear(item.cuttingDate)}`
                          : ''}
                      </Text>
                    </Box>
                    {action &&
                      ('href' in action ? (
                        <Button
                          as={Link_Next}
                          href={action.href}
                          size='xs'
                          colorScheme='green'
                          variant='outline'
                        >
                          {action.label}
                        </Button>
                      ) : (
                        <Button
                          as={Link_Next}
                          href={exportPage(item.exportId)}
                          size='xs'
                          colorScheme='green'
                          variant='outline'
                        >
                          Abrir
                        </Button>
                      ))}
                  </Flex>
                );
              })}
            </GroupCard>
          ))}
          {showDocuments && (
            <GroupCard
              title='Documentos de embarque'
              count={queue.documents.count}
              listHref={QUEUE_LIST_PAGE.documents}
            >
              {queue.documents.bookings.slice(0, SHOWN).map((booking) => (
                <Flex
                  key={booking.bookingId}
                  justify='space-between'
                  align='center'
                  gap={2}
                >
                  <Box minW={0}>
                    <HStack spacing={2}>
                      <Text fontSize='sm' fontWeight='semibold'>
                        {booking.bookingNumber}
                      </Text>
                      <Badge colorScheme={SEMAPHORE_COLOR[booking.semaphore]}>
                        {booking.statusLabel}
                      </Badge>
                    </HStack>
                    <Text fontSize='xs' color='gray.600' noOfLines={1}>
                      {missingSummary(booking.missing, 1)[0] ?? ''}
                    </Text>
                  </Box>
                  <Button
                    as={Link_Next}
                    href={`/dashboard/export/bookings/${booking.bookingId}`}
                    size='xs'
                    colorScheme='green'
                    variant='outline'
                  >
                    Documentos
                  </Button>
                </Flex>
              ))}
            </GroupCard>
          )}
        </SimpleGrid>
      )}
    </Box>
  );
}
