'use client';
import {
  Box,
  CloseButton,
  Drawer,
  Flex,
  IconButton,
  Portal,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Logo } from './Logo';
import { useSidenav } from './sidenav/sidenav-context';
import SidenavItems, { SidenavItem } from './sidenav/sidenav-items';
import { getNavItems } from './sidenav/SideNavItems';
import { useMenuCounts } from '../../hooks/useMenuCounts';

const THIN_SCROLLBAR = {
  scrollbarWidth: 'thin',
  scrollbarColor: 'var(--chakra-colors-border) transparent',
};

function Brand(): React.JSX.Element {
  return (
    <Flex asChild align='center' gap={3} minW={0}>
      <NextLink href='/dashboard'>
        <Logo width={32} height={32} />
        <Text
          fontWeight='semibold'
          color='fg.heading'
          letterSpacing='-0.01em'
          truncate
        >
          Exportmétricas
        </Text>
      </NextLink>
    </Flex>
  );
}

function Panel({
  navItems,
  collapsed,
  header,
}: {
  navItems: SidenavItem[];
  collapsed: boolean;
  header: React.ReactNode;
}): React.JSX.Element {
  return (
    <Flex direction='column' h='full'>
      <Flex
        align='center'
        justify={collapsed ? 'center' : 'space-between'}
        gap={2}
        h='16'
        px={collapsed ? 2 : 4}
        borderBottomWidth='1px'
        flexShrink={0}
      >
        {header}
      </Flex>
      <Box
        flex='1'
        overflowY='auto'
        overflowX='hidden'
        px={collapsed ? 2 : 3}
        py={4}
        css={THIN_SCROLLBAR}
      >
        <SidenavItems navItems={navItems} isCollapsed={collapsed} />
      </Box>
      {!collapsed && (
        <Text
          fontSize='xs'
          color='fg.muted'
          px={4}
          py={3}
          borderTopWidth='1px'
          flexShrink={0}
        >
          © 2025 Exportmétricas
        </Text>
      )}
    </Flex>
  );
}

export default function SidenavBar({
  isCollapsed,
  onToggleCollapse,
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}): React.JSX.Element {
  const counts = useMenuCounts();
  const { data: session } = useSession();
  const navItems = getNavItems(counts.counts, session?.user || null);
  const { open: isOpen, onClose } = useSidenav();
  const pathname = usePathname();

  // On a phone the drawer covers the page it just opened.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const toggle = (
    <IconButton
      aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
      size='sm'
      variant='ghost'
      color='fg.muted'
      onClick={onToggleCollapse}
    >
      {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
    </IconButton>
  );

  return (
    <>
      <Box
        pos='sticky'
        top='0'
        h='100vh'
        w={{ base: 0, md: isCollapsed ? '80px' : '280px' }}
        bg='bg.panel'
        borderRightWidth='1px'
        overflow='hidden'
        transition='width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        zIndex={10}
      >
        <Panel
          navItems={navItems}
          collapsed={isCollapsed}
          header={
            isCollapsed ? (
              toggle
            ) : (
              <>
                <Brand />
                {toggle}
              </>
            )
          }
        />
      </Box>

      <Drawer.Root
        open={isOpen}
        placement='start'
        size='xs'
        onOpenChange={(e) => {
          if (!e.open) onClose();
        }}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg='bg.panel'>
              <Drawer.Body p='0'>
                <Panel
                  navItems={navItems}
                  collapsed={false}
                  header={
                    <>
                      <Brand />
                      <Drawer.CloseTrigger asChild position='static'>
                        <CloseButton size='sm' />
                      </Drawer.CloseTrigger>
                    </>
                  }
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}
