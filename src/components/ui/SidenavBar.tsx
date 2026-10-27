'use client';
import { Box, CloseButton, Drawer, Flex, Icon, IconButton, Text, Portal } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useColorModeValue } from "./color-mode";
import { Logo } from './Logo';
import { useSidenav } from './sidenav/sidenav-context';
import SidenavItems from './sidenav/sidenav-items';
import { getNavItems } from './sidenav/SideNavItems';
import { useMenuCounts } from '../../hooks/useMenuCounts';

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
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const scrollbarThumbColor = useColorModeValue('#48BB78', '#2F855A');
  const scrollbarThumbHover = useColorModeValue('#38A169', '#68D391');

  const shadowColor = useColorModeValue(
    'rgba(0, 0, 0, 0.1)',
    'rgba(0, 0, 0, 0.3)'
  );

  const headerBg = useColorModeValue(
    'linear(135deg, green.400 0%, green.600 100%)',
    'linear(135deg, green.500 0%, green.700 100%)'
  );

  const { open: isOpen, onClose } = useSidenav();
  const pathname = usePathname();

  // On a phone the drawer covers the page it just opened.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <Flex
        direction='column'
        pos='sticky'
        top='0'
        h='100vh'
        w={{ base: 0, md: isCollapsed ? '100px' : '280px' }}
        bg={bg}
        borderRight='1px solid'
        borderColor={borderColor}
        boxShadow={`0 4px 20px ${shadowColor}`}
        overflow='hidden'
        transition='all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        zIndex={10}
      >
        <Box
          bgGradient={headerBg}
          position='relative'
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '1px',
            bg: 'whiteAlpha.200',
          }}
          h={'90px'}
        >
          <Flex
            align='center'
            justify='space-between'
            p='6'
            h='90px'
            position='relative'
            mr={isCollapsed ? '4' : 'auto'}
          >
            <Flex
              align='center'
              cursor='pointer'
              onClick={() => window.location.assign('/dashboard')}
              transition='all 0.2s'
              _hover={{
                transform: 'scale(1.05)',
              }}
              display={{ md: isCollapsed ? 'none' : 'flex' }}
            >
              <Box
                p='2'
                bg='whiteAlpha.200'
                borderRadius='xl'
                backdropFilter='blur(10px)'
                border='1px solid'
                borderColor='whiteAlpha.300'
              >
                <Icon boxSize='8' color='white' asChild><Logo /></Icon>
              </Box>
              {!isCollapsed && (
                <Text
                  ml='2'
                  fontSize='md'
                  fontWeight='bold'
                  color='white'
                  letterSpacing='wide'
                  textShadow='0 2px 4px rgba(0,0,0,0.2)'
                >
                  Exportmétricas
                </Text>
              )}
            </Flex>

            <IconButton
              aria-label='Colapsar sidebar'
              size='sm'
              variant='ghost'
              color='white'
              onClick={onToggleCollapse}
              borderRadius='lg'
              bg='whiteAlpha.200'
              backdropFilter='blur(10px)'
              border='1px solid'
              borderColor='whiteAlpha.300'
              _hover={{
                bg: 'whiteAlpha.300',
                transform: 'scale(1.1)',
              }}
              transition='all 0.2s'>{isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}</IconButton>
          </Flex>
        </Box>

        <Box
          flex='1'
          overflowY='auto'
          overflowX='hidden'
          px={isCollapsed ? 0 : 2}

          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
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
          <SidenavItems navItems={navItems} isCollapsed={isCollapsed} />
        </Box>

        <Box
          h='60px'
          bgGradient={useColorModeValue(
            'linear(to-t, gray.50 0%, transparent 100%)',
            'linear(to-t, gray.700 0%, transparent 100%)'
          )}
          borderTop='1px solid'
          borderColor={borderColor}
          display='flex'
          alignItems='center'
          justifyContent='center'
          px='4'
        >
          {!isCollapsed && (
            <Text fontSize='xs' color={borderColor} textAlign='center'>
              © 2025 Exportmétricas
            </Text>
          )}
        </Box>
      </Flex>

      <Drawer.Root open={isOpen} placement='start' size='xs' onOpenChange={e => {
        if (!e.open) {
          onClose();
        }
      }}>
        <Portal>

          <Drawer.Backdrop backdropFilter='blur(4px)' />
          <Drawer.Positioner>
            <Drawer.Content borderRadius='0 20px 20px 0' shadow='2xl' bg={bg}>
              <Drawer.CloseTrigger asChild top='4' insetEnd='4'>
                <CloseButton size='sm' />
              </Drawer.CloseTrigger>
              <Drawer.Body p='0'>
                <Box
                  bgGradient={headerBg}
                  position='relative'
                  _after={{
                    content: '""',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '1px',
                    bg: 'whiteAlpha.200',
                  }}
                >
                  <Flex
                    align='center'
                    justify='space-between'
                    p='6'
                    h='120px'
                    position='relative'
                  >
                    <Flex
                      align='center'
                      cursor='pointer'
                      onClick={() => {
                        onClose();
                        window.location.assign('/dashboard');
                      }}
                      transition='all 0.2s'
                      _hover={{
                        transform: 'scale(1.05)',
                      }}
                    >
                      <Box
                        p='2'
                        bg='whiteAlpha.200'
                        borderRadius='xl'
                        backdropFilter='blur(10px)'
                        border='1px solid'
                        borderColor='whiteAlpha.300'
                      >
                        <Icon boxSize='8' color='white' asChild><Logo /></Icon>
                      </Box>
                      <Text
                        ml='4'
                        fontSize='xl'
                        fontWeight='bold'
                        color='white'
                        letterSpacing='wide'
                        textShadow='0 2px 4px rgba(0,0,0,0.2)'
                      >
                        Exportmétricas
                      </Text>
                    </Flex>
                  </Flex>
                </Box>

                <Box
                  overflowY='auto'
                  flex='1'
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: useColorModeValue('gray.300', 'gray.600'),
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: useColorModeValue('gray.400', 'gray.500'),
                    },
                  }}
                >
                  <SidenavItems navItems={navItems} isCollapsed={false} />
                </Box>

                <Box
                  h='40px'
                  bgGradient={useColorModeValue(
                    'linear(to-t, gray.50 0%, transparent 100%)',
                    'linear(to-t, gray.700 0%, transparent 100%)'
                  )}
                  borderTop='1px solid'
                  borderColor={borderColor}
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  px='4'
                >
                  <Text
                    fontSize='xs'
                    color={useColorModeValue('gray.500', 'gray.400')}
                    textAlign='center'
                  >
                    © 2025 Exportmétricas
                  </Text>
                </Box>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>

        </Portal>
      </Drawer.Root>
    </>
  );
}
