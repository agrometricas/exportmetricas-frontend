'use client';
import { Box, Breadcrumb, Flex, HStack, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FiHome, FiMenu } from 'react-icons/fi';
import MenuIcon from './MenuIcon';
import MenuNotification from './MenuNotifications';
import QuickSearch from './QuickSearch';
import { generateBreadcrumbs } from '../../../utils/breadcrumbs';
import { useSidenav } from '../sidenav/sidenav-context';

export const AppBar = (): React.JSX.Element => {
  const { onOpen } = useSidenav();
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <Box
      as='header'
      position='sticky'
      top='0'
      zIndex='docked'
      h='16'
      px={{ base: 4, md: 6 }}
      bg='bg.panel'
      borderBottomWidth='1px'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      gap={4}
      flexShrink={0}
    >
      <IconButton
        aria-label='Abrir menú'
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant='ghost'
        size='sm'
      >
        <FiMenu />
      </IconButton>

      <Flex align='center' minW='0' display={{ base: 'none', md: 'flex' }}>
        <Breadcrumb.Root size='sm'>
          <Breadcrumb.List>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={bc.href + idx}>
                {idx > 0 && <Breadcrumb.Separator />}
                <Breadcrumb.Item>
                  {bc.isCurrent ? (
                    <Breadcrumb.CurrentLink
                      color='fg.heading'
                      fontWeight='medium'
                      display='flex'
                      alignItems='center'
                      gap='1.5'
                    >
                      {idx === 0 ? <FiHome /> : null}
                      {bc.name}
                    </Breadcrumb.CurrentLink>
                  ) : (
                    <Breadcrumb.Link
                      asChild
                      color='fg.muted'
                      display='flex'
                      alignItems='center'
                      gap='1.5'
                    >
                      <NextLink href={bc.href}>
                        {idx === 0 ? <FiHome /> : null}
                        {bc.name}
                      </NextLink>
                    </Breadcrumb.Link>
                  )}
                </Breadcrumb.Item>
              </React.Fragment>
            ))}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Flex>

      <HStack gap={2} align='center'>
        <QuickSearch />
        <MenuNotification />
        <MenuIcon />
      </HStack>
    </Box>
  );
};
