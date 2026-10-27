/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  List,
  Icon,
  Flex,
  Text,
  Link,
  Accordion,
  Box,
  Badge,
  IconButton,
  HoverCard,
  VStack,
  Portal,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { IconType } from 'react-icons';
import { FiPlus, FiChevronRight } from 'react-icons/fi';
import { Tooltip } from '@/components/ui/tooltip';
import { AccordionMenu } from './AccordionMenu';
import { isMenuEntryActive } from './menuActive';
import { useColorModeValue } from "../color-mode";

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
  mode?: 'semi' | 'over';
  isCollapsed?: boolean;
}



export function SidenavItems({
  navItems,
  mode = 'semi',
  isCollapsed = false,
}: SidenavItemsProps): React.JSX.Element {
  const pathname = usePathname();

  const isAble = pathname !== '/dashboard/onboarding';

  const activeColor = useColorModeValue('green.600', 'green.300');
  const inactiveColor = useColorModeValue('gray.500', 'gray.400');
  const activeBg = useColorModeValue('green.50', 'green.900');
  const hoverBg = useColorModeValue('green.50', 'green.700');
  const borderColor = useColorModeValue('green.200', 'green.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const activeTextColor = useColorModeValue('green.700', 'green.200');
  const popoverBg = useColorModeValue('white', 'gray.800');
  const popoverBorder = useColorModeValue('gray.200', 'gray.600');

  const isItemActive = (p: string): boolean =>
    pathname === p || pathname.startsWith(p + '/');

  const isMenuItemActive = (item: SidenavItem): boolean =>
    item.menu?.some((m) => isMenuEntryActive(pathname, m)) || false;

  const renderBadge = (
    input?: SidenavItem['badge'] | SidenavMenuItem['badge'],
    count?: number
  ): React.JSX.Element | null => {
    const c =
      typeof count === 'number' && count > 0
        ? count
        : input?.count && input.count > 0
          ? input.count
          : undefined;
    if (!c) return null;

    return (
      <Badge
        variant={(input as any)?.variant || 'solid'}
        colorPalette={(input as any)?.color || 'red'}
        fontSize='xs'
        borderRadius='full'
        minW='22px'
        h='22px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        fontWeight='semibold'
        shadow='sm'
      >
        {c}
      </Badge>
    );
  };

  const renderNewIndicator = (isNew?: boolean): React.JSX.Element =>
    isNew ? (
      <Box
        w='8px'
        h='8px'
        bg='orange.400'
        borderRadius='full'
        animation='pulse 2s infinite'
        shadow='sm'
        position='relative'
        _after={{
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          w: '12px',
          h: '12px',
          bg: 'orange.200',
          borderRadius: 'full',
          animation: 'ping 2s infinite',
        }}
      />
    ) : (<></>);

  const CollapsedMenuItem = ({ item }: { item: SidenavItem }): React.JSX.Element => {
    const active = isMenuItemActive(item);

    return (
      <HoverCard.Root
        openDelay={300}
        positioning={{
          placement: 'right-start'
        }}>
        <HoverCard.Trigger asChild>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            w='65px'
            h='65px'
            borderRadius='xl'
            bg={active ? activeBg : 'transparent'}
            border='2px solid'
            borderColor={active ? borderColor : 'transparent'}
            transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            _hover={{
              bg: active ? activeBg : hoverBg,
              transform: 'translateY(-1px)',
              shadow: 'md',
            }}
            cursor='pointer'
            position='relative'
            overflow='hidden'
          >
            {active && (
              <Box
                position='absolute'
                left='0'
                top='0'
                bottom='0'
                w='4px'
                bg='green.500'
                borderRadius='0 4px 4px 0'
              />
            )}

            <Icon
              boxSize='20px'
              color={active ? activeColor : inactiveColor}
              transition='all 0.2s'
              asChild><item.icon /></Icon>

            {/* count/badge + NEW compactos */}
            {item.isNew && (
              <Box
                position='absolute'
                top='8px'
                right='8px'
                w='6px'
                h='6px'
                bg='orange.400'
                borderRadius='full'
                animation='pulse 2s infinite'
              />
            )}
            {(item.count || item.badge?.count) && (
              <Box position='absolute' top='6px' right='6px'>
                {renderBadge(item.badge, item.count)}
              </Box>
            )}
          </Box>
        </HoverCard.Trigger>
        <Portal>
          <HoverCard.Positioner>
            <HoverCard.Content
              bg={popoverBg}
              border='1px solid'
              borderColor={popoverBorder}
              borderRadius='lg'
              boxShadow='xl'
              w='220px'
              ml={2}>
              <Box p={2}>
                <VStack gap={1} align='stretch'>
                  <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    color={textColor}
                    px={2}
                    py={1}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius='md'
                  >
                    {item.label}
                  </Text>

                  {item.menu?.map((mi, i) => (
                    <Tooltip
                      key={i}
                      content={mi.disabled ? 'Funcionalidad no disponible' : ''}
                      showArrow
                      positioning={{
                        placement: 'right'
                      }}
                    >
                      <Link

                        display='block'
                        bg={isMenuEntryActive(pathname, mi) ? activeBg : 'transparent'}
                        w='full'
                        borderRadius='lg'
                        transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        _hover={{
                          bg: mi.disabled ? 'transparent' : hoverBg,
                          transform: mi.disabled ? 'none' : 'translateX(6px)',
                          shadow: mi.disabled ? 'none' : 'sm',
                          textDecoration: 'none',
                        }}
                        cursor={mi.disabled ? 'not-allowed' : 'pointer'}
                        opacity={mi.disabled ? 0.5 : 1}
                        border='1px solid'
                        borderColor={
                          isMenuEntryActive(pathname, mi) ? borderColor : 'transparent'
                        }
                        position='relative'
                        overflow='hidden'
                        asChild
                      ><Link_Next href={mi.disabled ? '#' : mi.to}>
                          {isMenuEntryActive(pathname, mi) && (
                            <Box
                              position='absolute'
                              left='0'
                              top='0'
                              bottom='0'
                              w='3px'
                              bg='green.500'
                              borderRadius='0 2px 2px 0'
                            />
                          )}
                          <Flex align='center' p={2} pl={3}>
                            <Box
                              w='6px'
                              h='6px'
                              bg={isMenuEntryActive(pathname, mi) ? 'green.500' : 'gray.300'}
                              borderRadius='full'
                              mr={2}
                              transition='all 0.2s'
                              transform={
                                isMenuEntryActive(pathname, mi) ? 'scale(1.2)' : 'scale(1)'
                              }
                            />
                            <Text
                              fontSize='sm'
                              fontWeight={
                                isMenuEntryActive(pathname, mi) ? 'semibold' : 'medium'
                              }
                              color={
                                isMenuEntryActive(pathname, mi) ? activeTextColor : textColor
                              }
                              transition='all 0.2s'
                            >
                              {mi.label}
                            </Text>

                            <Flex ml='auto' align='center' gap={1}>
                              {renderNewIndicator(mi.isNew)}
                              {renderBadge(mi.badge, mi.count)}
                            </Flex>
                          </Flex>
                        </Link_Next></Link>
                    </Tooltip>
                  ))}
                </VStack>
              </Box>
            </HoverCard.Content>
          </HoverCard.Positioner>
        </Portal>
      </HoverCard.Root>
    );
  };

  const sidebarItemInSemiMode = (item: SidenavItem, idx: number): React.JSX.Element => {
    if (isCollapsed && item.isMenu) {
      return (
        <List.Item key={idx} opacity={item.disabled ? 0.5 : 1}>
          <CollapsedMenuItem item={item} />
        </List.Item>
      );
    }

    if (
      item.isMenu &&
      item.menu?.length === 2 &&
      item.menu[0].label.startsWith('Agregar') &&
      item.menu[1].label.startsWith('Mostrar')
    ) {
      const add = item.menu[0];
      const show = item.menu[1];

      const activeShow = isItemActive(show.to);
      const activeAdd = isItemActive(add.to);
      const active = activeShow || activeAdd;

      return (
        <List.Item key={idx} opacity={item.disabled ? 0.5 : 1}>
          <Box
            position='relative'
            overflow='hidden'
            borderRadius='xl'
            bg={active ? activeBg : 'transparent'}
            border='2px solid'
            borderColor={active ? borderColor : 'transparent'}
            transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            _hover={{
              bg: active ? activeBg : hoverBg,
              transform: 'translateY(-1px)',
              shadow: 'md',
            }}
            w={isCollapsed ? '65px' : 'auto'}
            h={isCollapsed ? '65px' : 'auto'}
          >
            {active && (
              <Box
                position='absolute'
                left='0'
                top='0'
                bottom='0'
                w='4px'
                bg='green.500'
                borderRadius='0 4px 4px 0'
              />
            )}

            <Flex
              align='center'
              justify={isCollapsed ? 'center' : 'space-between'}
              px={isCollapsed ? 0 : '20px'}
              py={isCollapsed ? 0 : '16px'}
              h={isCollapsed ? '100%' : 'auto'}
              gap={3}
            >
              <Link

                display='flex'
                alignItems='center'
                justifyContent={isCollapsed ? 'center' : 'flex-start'}
                flex={isCollapsed ? 'none' : '1'}
                w={isCollapsed ? '100%' : 'auto'}
                h={isCollapsed ? '100%' : 'auto'}
                _hover={{ textDecoration: 'none' }}
                cursor={!isAble || item.disabled ? 'not-allowed' : 'pointer'}
                asChild
              ><Link_Next href={!isAble || item.disabled ? '#' : show.to}>
                  <Icon
                    boxSize='20px'
                    color={active ? activeColor : inactiveColor}
                    transition='all 0.2s'
                    asChild><item.icon /></Icon>
                  {!isCollapsed && (
                    <>
                      <Text
                        ml='4'
                        fontWeight={active ? 'semibold' : 'medium'}
                        color={active ? activeTextColor : textColor}
                        fontSize='sm'
                        transition='all 0.2s'
                      >
                        {item.label}
                      </Text>
                      <Flex ml='auto' align='center' gap={1}>
                        {renderNewIndicator(item.isNew)}
                        {renderBadge(item.badge, item.count)}
                      </Flex>
                    </>
                  )}
                </Link_Next></Link>

              {!isCollapsed && (
                <IconButton

                  aria-label={add.label}
                  size='sm'
                  fontSize='16px'
                  borderRadius='lg'
                  variant='ghost'
                  colorPalette={activeAdd ? 'green' : undefined}
                  color={activeAdd ? 'green.600' : 'green.500'}
                  bg={activeAdd ? 'green.100' : 'transparent'}
                  border={
                    activeAdd
                      ? '1px solid var(--chakra-colors-green-200)'
                      : 'none'
                  }
                  _hover={{
                    bg: activeAdd ? 'green.200' : 'green.100',
                    color: activeAdd ? 'white' : 'green.600',
                    transform: 'scale(1.05)',
                  }}
                  _active={{
                    bg: activeAdd ? 'green.200' : 'green.200',
                    transform: 'scale(0.96)',
                  }}
                  cursor={!isAble || add.disabled ? 'not-allowed' : 'pointer'
                  }
                  asChild><Link_Next href={!isAble || add.disabled ? '#' : add.to}><FiPlus /></Link_Next></IconButton>
              )}
            </Flex>
          </Box>
        </List.Item>
      );
    }

    if (item.isMenu) {
      return (
        <List.Item key={idx} opacity={item.disabled ? 0.5 : 1}>
          <AccordionMenu item={item} isCollapsed={isCollapsed} />
        </List.Item>
      );
    }

    const active = isItemActive(item.to);
    return (
      <List.Item key={idx} opacity={item.disabled ? 0.5 : 1}>
        <Tooltip
          content={item.disabled ? 'Funcionalidad no disponible' : item.label}
          showArrow
          disabled={!isCollapsed}
          positioning={{
            placement: 'right'
          }}
        >
          <Link

            display='flex'
            alignItems='center'
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
            px={isCollapsed ? 0 : '20px'}
            py={isCollapsed ? 0 : '16px'}
            bg={active ? activeBg : 'transparent'}
            w={isCollapsed ? '65px' : 'full'}
            h={isCollapsed ? '65px' : 'auto'}
            borderRadius='xl'
            border='2px solid'
            borderColor={active ? borderColor : 'transparent'}
            transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            _hover={{
              bg: item.disabled ? 'transparent' : active ? activeBg : hoverBg,
              transform: item.disabled ? 'none' : 'translateY(-1px)',
              shadow: item.disabled ? 'none' : 'md',
              textDecoration: 'none',
            }}
            cursor={!isAble || item.disabled ? 'not-allowed' : 'pointer'}
            position='relative'
            overflow='hidden'
            asChild
          ><Link_Next href={!isAble || item.disabled ? '#' : item.to}>
              {active && (
                <Box
                  position='absolute'
                  left='0'
                  top='0'
                  bottom='0'
                  w='4px'
                  bg='green.500'
                  borderRadius='0 4px 4px 0'
                />
              )}
              <Icon
                boxSize='20px'
                color={active ? activeColor : inactiveColor}
                transition='all 0.2s'
                asChild><item.icon /></Icon>
              {!isCollapsed && (
                <>
                  <Text
                    ml='4'
                    fontWeight={active ? 'semibold' : 'medium'}
                    color={active ? activeTextColor : textColor}
                    fontSize='sm'
                    transition='all 0.2s'
                  >
                    {item.label}
                  </Text>
                  <Flex ml='auto' align='center' gap={1}>
                    {renderNewIndicator(item.isNew)}
                    {renderBadge(item.badge, item.count)}
                  </Flex>
                </>
              )}

              {isCollapsed && (
                <>
                  {item.isNew && (
                    <Box
                      position='absolute'
                      top='8px'
                      right='8px'
                      w='6px'
                      h='6px'
                      bg='orange.400'
                      borderRadius='full'
                      animation='pulse 2s infinite'
                    />
                  )}
                  {(item.count || item.badge?.count) && (
                    <Box position='absolute' top='6px' right='6px'>
                      {renderBadge(item.badge, item.count)}
                    </Box>
                  )}
                </>
              )}
            </Link_Next></Link>
        </Tooltip>
      </List.Item>
    );
  };

  const sidebarItemInOverMode = (item: SidenavItem, idx: number): React.JSX.Element => (
    <List.Item key={idx} opacity={item.disabled ? 0.5 : 1}>
      {item.isMenu ? (
        <Accordion.Root collapsible w='full' borderY='0px'>
          <Accordion.Item borderY='0px' value='item-0'>
            <Accordion.ItemTrigger px='12px' py='12px' borderRadius='md' bg='green.200'>
              <Box flex='1' textAlign='left'>
                <Flex align='center' gap={2}>
                  <Icon boxSize='5' color='green.700' asChild><item.icon /></Icon>
                  <Text fontWeight='semibold' color='green.800'>
                    {item.label}
                  </Text>
                  <Box ml='auto' display='flex' alignItems='center' gap={2}>
                    {renderBadge(item.badge, item.count)}
                  </Box>
                </Flex>
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent pb={3} pt={2}><Accordion.ItemBody>
                {item.menu?.map((mi, i) => (
                  <Link key={i}

                    display='block'
                    _focus={{ bg: 'gray.100' }}
                    _hover={{ bg: 'gray.200', textDecoration: 'none' }}
                    _currentPage={{ bg: 'orange.500', color: 'white' }}
                    w='full'
                    borderRadius='md'
                    asChild><Link_Next href={mi.disabled ? '#' : mi.to}>
                      <Flex align='center' p={2} gap={2}>
                        <FiChevronRight />
                        <Text>{mi.label}</Text>
                        <Box ml='auto' display='flex' alignItems='center' gap={1}>
                          {renderNewIndicator(mi.isNew)}
                          {renderBadge(mi.badge, mi.count)}
                        </Box>
                      </Flex>
                    </Link_Next></Link>
                ))}
              </Accordion.ItemBody></Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      ) : (
        <Link

          display='block'
          _focus={{ bg: 'gray.100' }}
          _hover={{ bg: 'gray.200', textDecoration: 'none' }}
          _currentPage={{ bg: 'orange.500', color: 'white' }}
          w='full'
          borderRadius='md'
          asChild
        ><Link_Next href={!isAble || item.disabled ? '#' : item.to}>
            <Flex align='center' p={2} gap={2}>
              <Icon boxSize='5' color='gray.600' asChild><item.icon /></Icon>
              <Text>{item.label}</Text>
              <Box ml='auto' display='flex' alignItems='center' gap={1}>
                {renderNewIndicator(item.isNew)}
                {renderBadge(item.badge, item.count)}
              </Box>
            </Flex>
          </Link_Next></Link>
      )}
    </List.Item>
  );

  return (
    <List.Root
      gap={3}
      w='full'
      px={isCollapsed ? 2 : 4}
      pb={2}
      mt={{ base: 2, md: isCollapsed ? '10px' : '20px' }}
    >
      {mode === 'semi'
        ? navItems.map(sidebarItemInSemiMode)
        : navItems.map(sidebarItemInOverMode)}
    </List.Root>
  );
}

export default SidenavItems;
