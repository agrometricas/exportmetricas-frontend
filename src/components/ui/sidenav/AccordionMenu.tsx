'use client';
import { Accordion, Box, Flex, Icon, Link, Text, Badge, IconButton } from '@chakra-ui/react';
import Link_Next from 'next/link';
import { usePathname } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';
import { Tooltip } from '@/components/ui/tooltip';
import { isMenuEntryActive } from './menuActive';
import { SidenavItem, SidenavMenuItem } from './sidenav-items';
import { useColorModeValue } from "../color-mode";

interface AccordionMenuProps {
  item: SidenavItem;
  isCollapsed?: boolean;
}

export function AccordionMenu({
  item,
  isCollapsed = false,
}: AccordionMenuProps): React.JSX.Element {
  const pathname = usePathname();
  const isAble = pathname !== '/dashboard/onboarding';

  const isMenuItemActive = (it: SidenavItem): boolean =>
    it.menu?.some((m) => isMenuEntryActive(pathname, m)) || false;

  const normalize = (s: string): string =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const singular = (s: string): string => {
    if (s.endsWith('es')) return s.slice(0, -2);
    if (s.endsWith('s')) return s.slice(0, -1);
    return s;
  };

  const isAdd = (label: string): boolean => /^(agregar|añadir|crear)\b/i.test(label);
  const addEntityFrom = (label: string): string =>
    singular(
      normalize(
        label.replace(/^(agregar|añadir|crear)\s+/i, '').trim()
      )
    );

  const viewEntityFrom = (label: string): string => singular(normalize(label));

  const renderBadgeCombined = (
    badge?: SidenavItem['badge'] | SidenavMenuItem['badge'],
    count?: number
  ): React.JSX.Element | null => {
    const c =
      typeof count === 'number' && count > 0
        ? count
        : badge?.count && badge.count > 0
          ? badge.count
          : undefined;
    if (!c) return null;
    return (
      <Badge
        ml='auto'
        variant={badge?.variant || 'solid'}
        colorPalette={badge?.color || 'red'}
        fontSize='xs'
        borderRadius='full'
        minW='20px'
        h='20px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        fontWeight='semibold'
      >
        {c}
      </Badge>
    );
  };

  const renderNewIndicator = (isNew?: boolean): React.JSX.Element | null =>
    isNew ? (
      <Box w='6px' h='6px' bg='orange.400' borderRadius='full' ml='2' animation='pulse 2s infinite' />
    ) : null;

  const groups: { key: string; view?: SidenavMenuItem; add?: SidenavMenuItem }[] = [];
  const singles: SidenavMenuItem[] = [];
  const map = new Map<string, { key: string; view?: SidenavMenuItem; add?: SidenavMenuItem }>();

  (item.menu ?? []).forEach((mi) => {
    const label = mi.label ?? '';
    if (isAdd(label)) {
      const key = addEntityFrom(label);
      const g = map.get(key) || ((): { key: string; view?: SidenavMenuItem; add?: SidenavMenuItem } => { const x = { key }; map.set(key, x); groups.push(x); return x; })();
      g.add = mi;
    } else {
      const key = viewEntityFrom(label);
      const g = map.get(key) || ((): { key: string; view?: SidenavMenuItem; add?: SidenavMenuItem } => { const x = { key }; map.set(key, x); groups.push(x); return x; })();
      if (!g.view) g.view = mi;
    }
  });

  groups.forEach((g) => {
    if (!(g.view && g.add)) {
      if (g.view) singles.push(g.view);
      if (g.add) singles.push(g.add);
    }
  });

  const activeBg = useColorModeValue('green.50', 'green.900');
  const hoverBg = useColorModeValue('green.50', 'green.700');
  const borderColor = useColorModeValue('green.200', 'green.600');
  const titleColor = useColorModeValue('gray.700', 'gray.200');
  const activeTitleColor = useColorModeValue('green.700', 'green.200');

  const defaultIndex = isMenuItemActive(item) ? ['item-0'] : [];

  return (
    <Accordion.Root collapsible w='full' borderY='0px' defaultValue={defaultIndex}>
      <Accordion.Item borderY='0px' value='item-0'>
        <Accordion.ItemTrigger
          px={isCollapsed ? 2 : '16px'}
          py={isCollapsed ? 2 : '14px'}
          bgColor={isMenuItemActive(item) ? 'green.50' : 'green.50'}
          borderRadius='lg'
          _hover={{ bg: 'green.50', borderColor: 'green.300', transform: 'translateX(2px)' }}
          transition='all 0.2s ease'
          border='1px solid'
          borderColor={isMenuItemActive(item) ? 'green.200' : 'green.200'}
          opacity={item.disabled ? 0.5 : 1}
          cursor={item.disabled ? 'not-allowed' : 'pointer'}
          position='relative'
          overflow='hidden'
        >
          {isMenuItemActive(item) && (
            <Box position='absolute' left='0' top='0' bottom='0' w='2px' bg='green.500' borderRadius='0 1px 1px 0' />
          )}

          <Flex align='center' flex='1' gap={isCollapsed ? 0 : 3} justify={isCollapsed ? 'center' : 'flex-start'}>
            <Icon
              boxSize={5}
              color={isMenuItemActive(item) ? 'green.600' : 'gray.600'}
              asChild><item.icon /></Icon>
            {!isCollapsed && (
              <>
                <Text ml={1} fontWeight={isMenuItemActive(item) ? 'semibold' : 'medium'} color={isMenuItemActive(item) ? 'green.700' : 'gray.700'}>
                  {item.label}
                </Text>
                {renderNewIndicator(item.isNew)}
                {renderBadgeCombined(item.badge, item.count)}
              </>
            )}
          </Flex>
          {!isCollapsed && <Accordion.ItemIndicator />}
        </Accordion.ItemTrigger>

        <Accordion.ItemContent pb={2} pl={isCollapsed ? 0 : 4} pr={isCollapsed ? 0 : 2}><Accordion.ItemBody>
            {groups
              .filter((g) => g.view && g.add)
              .map((g, idx) => {
                const view = g.view!;
                const add = g.add!;
                const activeView = isMenuEntryActive(pathname, view);
                const activeAdd = isMenuEntryActive(pathname, add);
                const active = activeView || activeAdd;

                const groupBadge =
                  renderBadgeCombined(add.badge, (add).count) ||
                  renderBadgeCombined(view.badge, (view).count);

                return (
                  <Box
                    key={`grp-${idx}-${g.key}`}
                    borderRadius='md'
                    bg={active ? activeBg : 'transparent'}
                    border='1px solid'
                    borderColor={active ? borderColor : 'transparent'}
                    mb={1.5}
                    position='relative'
                    overflow='hidden'
                    transition='all 0.2s ease'
                    _hover={{ bg: active ? activeBg : hoverBg }}
                  >
                    {active && <Box position='absolute' left='0' top='0' bottom='0' w='2px' bg='green.500' />}

                    <Flex align='center' gap={3} px={3} py={2.5} minW={0}>
                      <Box flex='1' minW={0}>
                        <Link

                          display='flex'
                          alignItems='center'
                          _hover={{ textDecoration: 'none' }}
                          cursor={!isAble || view.disabled ? 'not-allowed' : 'pointer'}
                          opacity={view.disabled ? 0.5 : 1}
                          asChild
                        ><Link_Next href={!isAble || view.disabled ? '#' : view.to}>
                            <Box
                              w='4px'
                              h='4px'
                              bg={activeView ? 'green.500' : 'gray.300'}
                              borderRadius='full'
                              mr={3}
                              flexShrink={0}
                            />
                            <Text
                              fontSize='sm'
                              fontWeight={activeView ? 'semibold' : 'medium'}
                              color={activeView ? activeTitleColor : titleColor}
                              flex='1'
                              minW={0}
                              whiteSpace='normal'
                              lineHeight='1.2'
                            >
                              {view.label}
                            </Text>
                          </Link_Next></Link>
                      </Box>

                      {groupBadge && (
                        <Box flexShrink={0}>
                          {groupBadge}
                        </Box>
                      )}
                      <Flex align='center' gap={2} mr='auto' flexShrink={0}>
                        <IconButton

                          aria-label={add.label}
                          size='sm'
                          borderRadius='md'
                          variant='ghost'
                          color={activeAdd ? 'green.600' : 'green.500'}
                          bg={activeAdd ? 'green.100' : 'transparent'}
                          border={activeAdd ? '1px solid var(--chakra-colors-green-200)' : 'none'}
                          _hover={{ bg: activeAdd ? 'green.200' : 'green.100', color: activeAdd ? 'white' : 'green.600' }}
                          _active={{ bg: 'green.200', transform: 'scale(0.96)' }}
                          cursor={!isAble || add.disabled ? 'not-allowed' : 'pointer'}
                          asChild><Link_Next href={!isAble || add.disabled ? '#' : add.to}><FiPlus /></Link_Next></IconButton>
                      </Flex>
                    </Flex>

                  </Box>
                );
              })}

            {singles.map((menuItem, index) => {
              const active = isMenuEntryActive(pathname, menuItem);
              return (
                <Tooltip
                  key={`single-${index}`}
                  content={menuItem.disabled ? 'Funcionalidad no disponible' : ''}
                  disabled={!menuItem.disabled}
                  positioning={{
                    placement: 'right'
                  }}
                >
                  <Link
                    display='block'

                    _focus={{ bg: 'green.50', outline: 'none' }}
                    _hover={{ bg: menuItem.disabled ? 'transparent' : 'green.50', transform: menuItem.disabled ? 'none' : 'translateX(4px)' }}
                    bg={active ? 'green.100' : 'transparent'}
                    w='full'
                    borderRadius='md'
                    mb={1}
                    transition='all 0.2s ease'
                    cursor={!isAble || menuItem.disabled ? 'not-allowed' : 'pointer'}
                    opacity={menuItem.disabled ? 0.5 : 1}
                    position='relative'
                    overflow='hidden'
                    asChild
                  ><Link_Next href={!isAble || menuItem.disabled ? '#' : menuItem.to}>
                      {active && <Box position='absolute' left='0' top='0' bottom='0' w='2px' bg='green.500' />}
                      <Flex alignItems='center' p={3} py={2.5}>
                        <Box w='4px' h='4px' bg={active ? 'green.500' : 'gray.300'} borderRadius='full' mr={3} textAlign={'start'} />
                        {!isCollapsed && (
                          <Text fontSize='sm' fontWeight={active ? 'semibold' : 'medium'} color={active ? 'green.700' : 'gray.600'}>
                            {menuItem.label}
                          </Text>
                        )}
                      </Flex>
                    </Link_Next></Link>
                </Tooltip>
              );
            })}
          </Accordion.ItemBody></Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default AccordionMenu;
