import {
  Badge,
  Box,
  Card,
  Flex,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
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
  return (
    <Card.Root boxShadow='sm'>
      <Card.Body p={4}>
        <Flex justify='space-between' align='center' gap={3} mb={2}>
          <Text as='h3' textStyle='md' fontWeight='semibold' color='fg.heading'>
            {title}
          </Text>
          <Badge colorPalette='orange' variant='subtle'>
            {count}
          </Badge>
        </Flex>
        <VStack align='stretch' gap={0}>
          {children}
        </VStack>
        {count > SHOWN && (
          <Link textStyle='sm' color='green.fg' mt={2} asChild>
            <Link_Next href={listHref}>Ver las {count}</Link_Next>
          </Link>
        )}
      </Card.Body>
    </Card.Root>
  );
}

function QueueRow({
  href,
  action,
  title,
  badge,
  detail,
}: {
  href: string;
  action: string;
  title: string;
  badge?: React.ReactNode;
  detail: string;
}): React.JSX.Element {
  return (
    <Flex
      align='center'
      gap={3}
      mx={-2}
      px={2}
      py={2}
      borderRadius='l2'
      _hover={{ bg: 'bg.muted' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'green.focusRing' }}
      asChild
    >
      <Link_Next href={href} title={action} aria-label={`${action}: ${title}`}>
        <Box flex='1' minW={0}>
          <Flex align='center' gap={2} minW={0}>
            <Text textStyle='sm' fontWeight='semibold' truncate>
              {title}
            </Text>
            {badge}
          </Flex>
          <Text textStyle='xs' color='fg.muted' truncate>
            {detail}
          </Text>
        </Box>
        <Icon
          as={FiChevronRight}
          boxSize={4}
          color='fg.subtle'
          flexShrink={0}
        />
      </Link_Next>
    </Flex>
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
    <Box as='section'>
      <Text as='h2' textStyle='h2' color='fg.heading' mb={4}>
        Lo que falta
      </Text>
      {nothing ? (
        <Text color='fg.muted'>Nada pendiente para tu área. Todo al día.</Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          gap={4}
          alignItems='start'
        >
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
                const link =
                  action && 'href' in action
                    ? { href: action.href, label: action.label }
                    : { href: exportPage(item.exportId), label: 'Abrir' };
                return (
                  <QueueRow
                    key={item.exportId}
                    href={link.href}
                    action={link.label}
                    title={item.farm}
                    detail={`${item.client} · ${item.boxes} cajas${
                      item.cuttingDate
                        ? ` · corte ${formatDayMonthYear(item.cuttingDate)}`
                        : ''
                    }`}
                  />
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
                <QueueRow
                  key={booking.bookingId}
                  href={`/dashboard/export/bookings/${booking.bookingId}`}
                  action='Documentos'
                  title={booking.bookingNumber}
                  badge={
                    <Badge
                      colorPalette={SEMAPHORE_COLOR[booking.semaphore]}
                      flexShrink={0}
                    >
                      {booking.statusLabel}
                    </Badge>
                  }
                  detail={missingSummary(booking.missing, 1)[0] ?? ''}
                />
              ))}
            </GroupCard>
          )}
        </SimpleGrid>
      )}
    </Box>
  );
}
