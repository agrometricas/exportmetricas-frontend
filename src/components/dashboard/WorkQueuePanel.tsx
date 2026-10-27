import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Text,
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
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  return (
    <Card.Root
      bg={cardBg}
      borderWidth='1px'
      borderColor={borderColor}
      borderRadius='xl'
    >
      <Card.Body>
        <Flex justify='space-between' align='center' mb={3}>
          <Heading size='sm'>{title}</Heading>
          <Badge colorPalette='orange' fontSize='sm'>
            {count}
          </Badge>
        </Flex>
        <VStack align='stretch' gap={3}>
          {children}
        </VStack>
        {count > SHOWN && (
          <Link fontSize='sm' color='green.fg' mt={3} display='block' asChild>
            <Link_Next href={listHref}>Ver las {count}</Link_Next>
          </Link>
        )}
      </Card.Body>
    </Card.Root>
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
        <Text color='fg.muted'>Nada pendiente para tu área. Todo al día.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
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
                      <Link fontSize='sm' fontWeight='semibold' asChild>
                        <Link_Next href={exportPage(item.exportId)}>
                          {item.farm}
                        </Link_Next>
                      </Link>
                      <Text fontSize='xs' color='fg.muted' lineClamp={1}>
                        {item.client} · {item.boxes} cajas
                        {item.cuttingDate
                          ? ` · corte ${formatDayMonthYear(item.cuttingDate)}`
                          : ''}
                      </Text>
                    </Box>
                    {action &&
                      ('href' in action ? (
                        <Button
                          size='xs'
                          colorPalette='green'
                          variant='outline'
                          asChild
                        >
                          <Link_Next href={action.href}>
                            {action.label}
                          </Link_Next>
                        </Button>
                      ) : (
                        <Button
                          size='xs'
                          colorPalette='green'
                          variant='outline'
                          asChild
                        >
                          <Link_Next href={exportPage(item.exportId)}>
                            Abrir
                          </Link_Next>
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
                    <HStack gap={2}>
                      <Text fontSize='sm' fontWeight='semibold'>
                        {booking.bookingNumber}
                      </Text>
                      <Badge colorPalette={SEMAPHORE_COLOR[booking.semaphore]}>
                        {booking.statusLabel}
                      </Badge>
                    </HStack>
                    <Text fontSize='xs' color='fg.muted' lineClamp={1}>
                      {missingSummary(booking.missing, 1)[0] ?? ''}
                    </Text>
                  </Box>
                  <Button
                    size='xs'
                    colorPalette='green'
                    variant='outline'
                    asChild
                  >
                    <Link_Next
                      href={`/dashboard/export/bookings/${booking.bookingId}`}
                    >
                      Documentos
                    </Link_Next>
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
