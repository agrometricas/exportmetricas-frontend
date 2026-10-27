'use client';
import { Box, Flex, Icon, IconButton, Text, Breadcrumb, HStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FiMenu, FiHome } from 'react-icons/fi';
import MenuIcon from './MenuIcon';
import MenuNotification from './MenuNotifications';
import QuickSearch from './QuickSearch';
import { generateBreadcrumbs } from '../../../utils/breadcrumbs';
import { useColorModeValue } from "../color-mode";
import { useSidenav } from '../sidenav/sidenav-context';

export const AppBar = (): React.JSX.Element => {
  const { onOpen } = useSidenav();
  const pathname = usePathname();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const shadowColor = useColorModeValue(
    'rgba(0, 0, 0, 0.05)',
    'rgba(0, 0, 0, 0.2)'
  );
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <Box
      as='header'
      px={{ base: '16px', md: '24px' }}
      py='16px'
      w='100%'
      h='90px'
      bg={bg}
      borderBottom='1px solid'
      borderColor={borderColor}
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      position='sticky'
      top='0'
      zIndex='100'
      boxShadow={`0 2px 12px ${shadowColor}`}
      backdropFilter='blur(8px)'
    >
      <Flex align='center' display={{ base: 'none', md: 'flex' }}>
        <Breadcrumb.Root fontSize='sm'>
          <Breadcrumb.List gap='12px'>{breadcrumbs.map((bc, idx: number) => (
              <Breadcrumb.Item key={idx}>
                <Breadcrumb.Link
                  href={bc.href}
                  color={bc.isCurrent ? 'green.600' : textColor}
                  fontWeight={bc.isCurrent ? 'semibold' : 'medium'}
                  px={2}
                  py={1}
                  borderRadius='md'
                  transition='all 0.2s'
                  _hover={{
                    textDecoration: 'none',
                    color: 'green.600',
                    bg: hoverBg,
                    transform: 'translateY(-1px)',
                  }}
                  display='flex'
                  alignItems='center'
                >
                  {idx === 0 ? (
                    <HStack gap={2}>
                      <Icon boxSize={4} asChild><FiHome /></Icon>
                      <Text>Dashboard</Text>
                    </HStack>
                  ) : (
                    bc.name
                  )}
                </Breadcrumb.Link>
              </Breadcrumb.Item>
            ))}</Breadcrumb.List>
        </Breadcrumb.Root>
      </Flex>

      <HStack
        gap={4}
        align='center'
        justifyContent={{ base: 'flex-end' }}
        flex={{ base: 1, md: 'auto' }}
      >
        <IconButton
          aria-label='Abrir menú'
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant='ghost'
          size='md'
          color={textColor}
          borderRadius='lg'
          h='44px'
          w='44px'
          transition='all 0.2s'
          _hover={{
            bg: useColorModeValue('green.50', 'green.900'),
            color: 'green.600',
            transform: 'scale(1.05)',
          }}
          _active={{
            bg: useColorModeValue('green.100', 'green.800'),
            transform: 'scale(0.95)',
          }}><FiMenu /></IconButton>
        <QuickSearch />
        <MenuNotification />
        <MenuIcon />
      </HStack>
    </Box>
  );
};
