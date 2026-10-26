/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  List,
  ListItem,
  Icon,
  Flex,
  Text,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Badge,
  Tooltip,
  IconButton,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  Portal,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { IconType } from 'react-icons';
import { FiPlus, FiChevronRight } from 'react-icons/fi';
import { AccordionMenu } from './AccordionMenu';
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
        colorScheme={(input as any)?.color || 'red'}
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
      <Popover trigger='hover' placement='right-start' openDelay={300}>
        <PopoverTrigger>
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
              as={item.icon}
              boxSize='20px'
              color={active ? activeColor : inactiveColor}
              transition='all 0.2s'
            />

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
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            bg={popoverBg}
            border='1px solid'
            borderColor={popoverBorder}
            borderRadius='lg'
            boxShadow='xl'
            w='220px'
            ml={2}
          >
            <PopoverBody p={2}>
              <VStack spacing={1} align='stretch'>
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
                    label={mi.disabled ? 'Funcionalidad no disponible' : ''}
                    placement='right'
                    hasArrow
                  >
                    <Link
                      as={Link_Next}
                      href={mi.disabled ? '#' : mi.to}
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
                    >
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
                    </Link>
                  </Tooltip>
                ))}
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    );
  };

  const sidebarItemInSemiMode = (item: SidenavItem, idx: number): React.JSX.Element => {
    if (isCollapsed && item.isMenu) {
      return (
        <ListItem key={idx} opacity={item.disabled ? 0.5 : 1}>
          <CollapsedMenuItem item={item} />
        </ListItem>
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
        <ListItem key={idx} opacity={item.disabled ? 0.5 : 1}>
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
                as={Link_Next}
                href={!isAble || item.disabled ? '#' : show.to}
                display='flex'
                alignItems='center'
                justifyContent={isCollapsed ? 'center' : 'flex-start'}
                flex={isCollapsed ? 'none' : '1'}
                w={isCollapsed ? '100%' : 'auto'}
                h={isCollapsed ? '100%' : 'auto'}
                _hover={{ textDecoration: 'none' }}
                cursor={!isAble || item.disabled ? 'not-allowed' : 'pointer'}
              >
                <Icon
                  as={item.icon}
                  boxSize='20px'
                  color={active ? activeColor : inactiveColor}
                  transition='all 0.2s'
                />
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
              </Link>

              {!isCollapsed && (
                <IconButton
                  as={Link_Next}
                  href={!isAble || add.disabled ? '#' : add.to}
                  aria-label={add.label}
                  icon={<FiPlus />}
                  size='sm'
                  fontSize='16px'
                  borderRadius='lg'
                  variant='ghost'
                  colorScheme={activeAdd ? 'green' : undefined}
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
                />
              )}
            </Flex>
          </Box>
        </ListItem>
      );
    }

    if (item.isMenu) {
      return (
        <ListItem key={idx} opacity={item.disabled ? 0.5 : 1}>
          <AccordionMenu item={item} isCollapsed={isCollapsed} />
        </ListItem>
      );
    }

    const active = isItemActive(item.to);
    return (
      <ListItem key={idx} opacity={item.disabled ? 0.5 : 1}>
        <Tooltip
          label={item.disabled ? 'Funcionalidad no disponible' : item.label}
          placement='right'
          hasArrow
          isDisabled={!isCollapsed}
        >
          <Link
            as={Link_Next}
            href={!isAble || item.disabled ? '#' : item.to}
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
              as={item.icon}
              boxSize='20px'
              color={active ? activeColor : inactiveColor}
              transition='all 0.2s'
            />
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
          </Link>
        </Tooltip>
      </ListItem>
    );
  };

  const sidebarItemInOverMode = (item: SidenavItem, idx: number): React.JSX.Element => (
    <ListItem key={idx} opacity={item.disabled ? 0.5 : 1}>
      {item.isMenu ? (
        <Accordion allowToggle w='full' borderY='0px'>
          <AccordionItem borderY='0px'>
            <AccordionButton px='12px' py='12px' borderRadius='md' bg='green.200'>
              <Box flex='1' textAlign='left'>
                <Flex align='center' gap={2}>
                  <Icon boxSize='5' as={item.icon} color='green.700' />
                  <Text fontWeight='semibold' color='green.800'>
                    {item.label}
                  </Text>
                  <Box ml='auto' display='flex' alignItems='center' gap={2}>
                    {renderBadge(item.badge, item.count)}
                  </Box>
                </Flex>
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={3} pt={2}>
              {item.menu?.map((mi, i) => (
                <Link
                  key={i}
                  as={Link_Next}
                  href={mi.disabled ? '#' : mi.to}
                  display='block'
                  _focus={{ bg: 'gray.100' }}
                  _hover={{ bg: 'gray.200', textDecoration: 'none' }}
                  _activeLink={{ bg: 'orange.500', color: 'white' }}
                  w='full'
                  borderRadius='md'
                >
                  <Flex align='center' p={2} gap={2}>
                    <FiChevronRight />
                    <Text>{mi.label}</Text>
                    <Box ml='auto' display='flex' alignItems='center' gap={1}>
                      {renderNewIndicator(mi.isNew)}
                      {renderBadge(mi.badge, mi.count)}
                    </Box>
                  </Flex>
                </Link>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      ) : (
        <Link
          as={Link_Next}
          href={!isAble || item.disabled ? '#' : item.to}
          display='block'
          _focus={{ bg: 'gray.100' }}
          _hover={{ bg: 'gray.200', textDecoration: 'none' }}
          _activeLink={{ bg: 'orange.500', color: 'white' }}
          w='full'
          borderRadius='md'
        >
          <Flex align='center' p={2} gap={2}>
            <Icon boxSize='5' as={item.icon} color='gray.600' />
            <Text>{item.label}</Text>
            <Box ml='auto' display='flex' alignItems='center' gap={1}>
              {renderNewIndicator(item.isNew)}
              {renderBadge(item.badge, item.count)}
            </Box>
          </Flex>
        </Link>
      )}
    </ListItem>
  );

  return (
    <List
      spacing={3}
      w='full'
      px={isCollapsed ? 2 : 4}
      pb={2}
      mt={{ base: 2, md: isCollapsed ? '10px' : '20px' }}
    >
      {mode === 'semi'
        ? navItems.map(sidebarItemInSemiMode)
        : navItems.map(sidebarItemInOverMode)}
    </List>
  );
}

export default SidenavItems;
