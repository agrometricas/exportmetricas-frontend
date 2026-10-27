'use client';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { ReactNode, ReactElement } from 'react';

export interface SidenavContainerProps {
  children: ReactNode;
  sidenav: ReactElement;
}

export function SidenavContainer({
  children,
  sidenav,
}: SidenavContainerProps): ReactElement {
  const bg = 'bg.panel';
  const borderColor = 'border';
  const mainBg = 'bg.subtle';

  return (
    <Grid
      templateAreas={`'sidebar main'`}
      templateColumns={{ base: '1fr', md: '250px 1fr' }}
      width='100%'
      minH='100vh'
      p='0'
    >
      <GridItem
        area='sidebar'
        as='aside'
        w='full'
        p={0}
        display={{ base: 'none', md: 'block' }}
      >
        <Box
          pos='sticky'
          top={0}
          w='full'
          borderRight='1px solid'
          borderColor={borderColor}
          p='0'
          height='100vh'
          overflow='hidden'
          bg={bg}
          transition='all 0.3s ease'
          boxShadow='sm'
        >
          {/* Área scrollable del sidebar */}
          <Box
            height='100%'
            overflow='auto'
            pb='80px' // espacio para footer del sidebar si aplica
            css={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'var(--chakra-colors-gray-300)',
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'var(--chakra-colors-gray-400)',
              },
            }}
          >
            {sidenav}
          </Box>
        </Box>
      </GridItem>

      <GridItem
        as='main'
        area='main'
        p='0'
        w='100%'
        bg={mainBg}
        minH='100vh'
        transition='all 0.3s ease'
      >
        <Box
          w='100%'
          h='100%'
          overflow='auto'
          css={{
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              background: 'var(--chakra-colors-gray-300)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'var(--chakra-colors-gray-400)',
            },
          }}
        >
          {children}
        </Box>
      </GridItem>
    </Grid>
  );
}

export default SidenavContainer;
