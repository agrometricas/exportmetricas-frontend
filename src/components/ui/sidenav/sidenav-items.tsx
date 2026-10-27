'use client';
import {
  Box,
  Flex,
  HoverCard,
  Icon,
  Link,
  Portal,
  Stack,
  Text,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { IconType } from 'react-icons';
import { AccordionMenu } from './AccordionMenu';
import { CountBadge, countOf } from './CountBadge';
import { isMenuEntryActive } from './menuActive';

export interface SidenavItem {
  icon: IconType;
  label: string;
  to: string;
  isMenu?: boolean;
  menu?: SidenavMenuItem[];
  count?: number;
  allowedRoles?: string[];
  badge?: {
    count?: number;
    color?: string;
    variant?: 'solid' | 'subtle' | 'outline';
  };
  isNew?: boolean;
  disabled?: boolean;
}

export interface SidenavMenuItem {
  label: string;
  to: string;
  match?: string[];
  count?: number;
  submenu?: SidenavMenuItem[];
  badge?: {
    count?: number;
    color?: string;
    variant?: 'solid' | 'subtle' | 'outline';
  };
  isNew?: boolean;
  disabled?: boolean;
}

export interface SidenavItemsProps {
  navItems: SidenavItem[];
  isCollapsed?: boolean;
}

function CollapsedGroup({ item }: { item: SidenavItem }): React.JSX.Element {
  const pathname = usePathname();
  const active =
    item.menu?.some((entry) => isMenuEntryActive(pathname, entry)) ?? false;

  return (
    <HoverCard.Root
      openDelay={150}
      closeDelay={100}
      positioning={{ placement: 'right-start', gutter: 12 }}
    >
      <HoverCard.Trigger asChild>
        <Flex
          as='button'
          aria-label={item.label}
          position='relative'
          align='center'
          justify='center'
          boxSize='11'
          mx='auto'
          rounded='md'
          color={active ? 'green.fg' : 'fg.muted'}
          bg={active ? 'green.subtle' : 'transparent'}
          _hover={{ bg: active ? 'green.subtle' : 'bg.muted', color: 'fg' }}
          transition='background 0.15s'
        >
          <Icon boxSize='5' asChild>
            <item.icon />
          </Icon>
          {countOf(item.badge, item.count) && (
            <Box position='absolute' top='0.5' right='0.5'>
              <Box boxSize='2' rounded='full' bg='red.solid' />
            </Box>
          )}
        </Flex>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content w='60' p='2' rounded='lg'>
            <Text textStyle='overline' color='fg.muted' px='2' py='1.5'>
              {item.label}
            </Text>
            <Stack gap='0.5'>
              {item.menu?.map((entry) => {
                const entryActive = isMenuEntryActive(pathname, entry);
                return (
                  <Link
                    key={entry.to}
                    asChild
                    display='flex'
                    alignItems='center'
                    gap='2'
                    px='2'
                    py='1.5'
                    rounded='md'
                    fontSize='sm'
                    color={entryActive ? 'green.fg' : 'fg'}
                    bg={entryActive ? 'green.subtle' : 'transparent'}
                    fontWeight={entryActive ? 'medium' : 'normal'}
                    _hover={{
                      bg: entryActive ? 'green.subtle' : 'bg.muted',
                      textDecoration: 'none',
                    }}
                  >
                    <Link_Next href={entry.disabled ? '#' : entry.to}>
                      <Text flex='1'>{entry.label}</Text>
                      <CountBadge value={countOf(entry.badge, entry.count)} />
                    </Link_Next>
                  </Link>
                );
              })}
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
}

function SingleItem({
  item,
  isCollapsed,
}: {
  item: SidenavItem;
  isCollapsed: boolean;
}): React.JSX.Element {
  const pathname = usePathname();
  const active = pathname === item.to || pathname.startsWith(item.to + '/');
  return (
    <Link
      asChild
      display='flex'
      alignItems='center'
      justifyContent={isCollapsed ? 'center' : 'flex-start'}
      gap='3'
      h='10'
      px={isCollapsed ? 0 : 3}
      rounded='md'
      fontSize='sm'
      fontWeight='medium'
      color={active ? 'green.fg' : 'fg'}
      bg={active ? 'green.subtle' : 'transparent'}
      _hover={{
        bg: active ? 'green.subtle' : 'bg.muted',
        textDecoration: 'none',
      }}
    >
      <Link_Next href={item.disabled ? '#' : item.to} aria-label={item.label}>
        <Icon boxSize='5' color={active ? 'green.fg' : 'fg.muted'} asChild>
          <item.icon />
        </Icon>
        {!isCollapsed && (
          <>
            <Text flex='1'>{item.label}</Text>
            <CountBadge value={countOf(item.badge, item.count)} />
          </>
        )}
      </Link_Next>
    </Link>
  );
}

export function SidenavItems({
  navItems,
  isCollapsed = false,
}: SidenavItemsProps): React.JSX.Element {
  return (
    <Stack as='nav' gap='1' w='full'>
      {navItems.map((item) => (
        <Box key={item.label} opacity={item.disabled ? 0.5 : 1}>
          {item.isMenu && isCollapsed && <CollapsedGroup item={item} />}
          {item.isMenu && !isCollapsed && <AccordionMenu item={item} />}
          {!item.isMenu && <SingleItem item={item} isCollapsed={isCollapsed} />}
        </Box>
      ))}
    </Stack>
  );
}

export default SidenavItems;
