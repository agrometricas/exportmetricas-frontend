'use client';
import {
  Accordion,
  Flex,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { CountBadge, countOf } from './CountBadge';
import { isMenuEntryActive } from './menuActive';
import { MenuRow, menuRows } from './menuRows';
import { SidenavItem } from './sidenav-items';

function Row({
  row,
  pathname,
  enabled,
}: {
  row: MenuRow;
  pathname: string;
  enabled: boolean;
}): React.JSX.Element {
  const { entry, add } = row;
  const active = isMenuEntryActive(pathname, entry);
  const addActive = !!add && isMenuEntryActive(pathname, add);
  const count =
    countOf(entry.badge, entry.count) ??
    (add ? countOf(add.badge, add.count) : undefined);

  return (
    <Flex align='center' gap='1' opacity={entry.disabled ? 0.5 : 1}>
      <Link
        asChild
        flex='1'
        minW='0'
        display='flex'
        alignItems='center'
        gap='2'
        px='2.5'
        py='1.5'
        rounded='md'
        fontSize='sm'
        color={active ? 'green.fg' : 'fg.muted'}
        fontWeight={active ? 'medium' : 'normal'}
        bg={active ? 'green.subtle' : 'transparent'}
        _hover={{
          bg: active ? 'green.subtle' : 'bg.muted',
          color: active ? 'green.fg' : 'fg',
          textDecoration: 'none',
        }}
      >
        <Link_Next href={enabled && !entry.disabled ? entry.to : '#'}>
          <Text flex='1' truncate>
            {entry.label}
          </Text>
          <CountBadge value={count} />
        </Link_Next>
      </Link>
      {add && (
        <IconButton
          asChild
          aria-label={add.label}
          title={add.label}
          size='2xs'
          variant='ghost'
          color={addActive ? 'green.fg' : 'fg.muted'}
          bg={addActive ? 'green.subtle' : 'transparent'}
          _hover={{ bg: 'green.subtle', color: 'green.fg' }}
        >
          <Link_Next href={enabled && !add.disabled ? add.to : '#'}>
            <FiPlus />
          </Link_Next>
        </IconButton>
      )}
    </Flex>
  );
}

export function AccordionMenu({
  item,
}: {
  item: SidenavItem;
}): React.JSX.Element {
  const pathname = usePathname();
  const enabled = pathname !== '/dashboard/onboarding';
  const active =
    item.menu?.some((entry) => isMenuEntryActive(pathname, entry)) ?? false;

  return (
    <Accordion.Root
      collapsible
      variant='plain'
      defaultValue={active ? [item.label] : []}
    >
      <Accordion.Item value={item.label}>
        <Accordion.ItemTrigger
          h='10'
          px='3'
          gap='3'
          rounded='md'
          cursor='pointer'
          _hover={{ bg: 'bg.muted' }}
        >
          <Icon boxSize='5' color={active ? 'green.fg' : 'fg.muted'} asChild>
            <item.icon />
          </Icon>
          <Text
            flex='1'
            textAlign='start'
            fontSize='sm'
            fontWeight={active ? 'semibold' : 'medium'}
            color={active ? 'fg.heading' : 'fg'}
          >
            {item.label}
          </Text>
          <CountBadge value={countOf(item.badge, item.count)} />
          <Accordion.ItemIndicator color='fg.muted' />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <Accordion.ItemBody pt='1' pb='2' ps='5' pe='0'>
            <Stack gap='0.5' borderStartWidth='1px' ps='2'>
              {menuRows(item.menu ?? []).map((row) => (
                <Row
                  key={row.entry.to}
                  row={row}
                  pathname={pathname}
                  enabled={enabled}
                />
              ))}
            </Stack>
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default AccordionMenu;
