'use client';
import { Box, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppBar } from './header/AppBar';
import SidenavProvider from './sidenav/sidenav-context';
import SidenavBar from './SidenavBar';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidenavProvider>
      <Box bg='bg.canvas' minH='100vh'>
        <Flex height='100vh' width='100%'>
          <Box
            as='aside'
            flexShrink={0}
            w={{ base: 0, md: isCollapsed ? '80px' : '280px' }}
            transition='width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            overflow='hidden'
          >
            <SidenavBar
              isCollapsed={isCollapsed}
              onToggleCollapse={() => setIsCollapsed((s) => !s)}
            />
          </Box>
          <Flex as='main' direction='column' flex='1' overflow='hidden'>
            <AppBar />
            <Box
              flex='1'
              overflow='auto'
              css={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'var(--chakra-colors-border) transparent',
              }}
            >
              {children}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </SidenavProvider>
  );
}
