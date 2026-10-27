'use client';
import { Box, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useColorModeValue } from './color-mode';
import { AppBar } from './header/AppBar';
import SidenavProvider from './sidenav/sidenav-context';
import SidenavBar from './SidenavBar';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const scrollbarThumbColor = useColorModeValue('#2a9d5aff', '#1d573aff');
  const scrollbarThumbHover = useColorModeValue('#1d7c49ff', '#4da06dff');

  return (
    <SidenavProvider>
      <Box bgColor={bgColor} minH='100vh'>
        <Flex height='100vh' width='100%'>
          <Box
            as='aside'
            flexShrink={0}
            w={{ base: 0, md: isCollapsed ? '80px' : '280px' }}
            transition='width 0.3s ease'
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
                '&::-webkit-scrollbar': {
                  width: '10px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: scrollbarThumbColor,
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: scrollbarThumbHover,
                },
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
