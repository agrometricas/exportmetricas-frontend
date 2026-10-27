'use client';
import {
  Badge,
  Box,
  Circle,
  Flex,
  Float,
  Heading,
  Icon,
  IconButton,
  Menu,
  SkeletonCircle,
  Text,
  Portal,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineNotifications } from 'react-icons/md';
import { useNotifications } from '../../../hooks/useNotifications';

const formatCount = (n: number): string => (n > 99 ? '99+' : n.toString());

const MenuNotification = (): React.JSX.Element => {
  const { notifications, isLoading } = useNotifications();
  const listBg = 'bg.panel';
  const borderColor = 'border';
  const textPrimary = 'fg.heading';
  const textSecondary = 'fg.muted';
  const hoverRow = 'bg.subtle';

  if (isLoading) {
    return <SkeletonCircle size='10' />;
  }

  const total = notifications.length;

  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <IconButton
          aria-label='Abrir notificaciones'
          variant='ghost'
          rounded='full'
          size='md'
          position='relative'
        >
          <MdOutlineNotifications />
          {total > 0 && (
            <Float placement='top-end' offset='2'>
              <Circle
                size='5'
                bg='red.solid'
                color='white'
                fontSize='2xs'
                fontWeight='bold'
              >
                {formatCount(total)}
              </Circle>
            </Float>
          )}
        </IconButton>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Box
              position='sticky'
              top='0'
              zIndex={1}
              bg={listBg}
              borderBottom='1px solid'
              borderColor={borderColor}
              px='16px'
              py='12px'
            >
              <Flex align='center' justify='space-between'>
                <Heading as='h4' fontSize='md' color={textPrimary}>
                  Notificaciones
                </Heading>
                <Badge
                  colorPalette={total > 0 ? 'red' : 'green'}
                  borderRadius='full'
                  px={3}
                  py={1}
                >
                  {total} pendiente{total === 1 ? '' : 's'}
                </Badge>
              </Flex>
            </Box>

            <Box
              maxH='60vh'
              overflowY='auto'
              py='6px'
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
              {total > 0 ? (
                notifications.map((n, i) => (
                  <Menu.Item
                    key={i}
                    alignItems='flex-start'
                    px='12px'
                    py='10px'
                    mx='6px'
                    borderRadius='lg'
                    transition='all 0.2s ease'
                    _hover={{
                      bg: hoverRow,
                      transform: 'translateX(4px)',
                    }}
                    value={String(i)}
                    asChild
                  >
                    <a href={n.href}>
                      <Flex w='full' gap={3}>
                        <Box
                          mt='6px'
                          minW='8px'
                          h='8px'
                          borderRadius='full'
                          bg='green.solid'
                        />
                        <Box flex='1' minW={0}>
                          <Text
                            fontWeight='semibold'
                            color={textPrimary}
                            lineClamp={2}
                          >
                            {n.message}
                          </Text>
                          {n.detail && (
                            <Text
                              fontSize='sm'
                              color={textSecondary}
                              lineClamp={2}
                            >
                              {n.detail}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                    </a>
                  </Menu.Item>
                ))
              ) : (
                <>
                  <Menu.Separator borderColor={borderColor} />
                  <Flex direction='column' align='center' py='28px' gap={2}>
                    <Icon boxSize='28px' color={textSecondary} asChild>
                      <MdOutlineNotifications />
                    </Icon>
                    <Heading as='h5' fontSize='sm' color={textPrimary}>
                      Sin notificaciones
                    </Heading>
                    <Text fontSize='sm' color={textSecondary}>
                      ¡Estás al día!
                    </Text>
                  </Flex>
                </>
              )}
            </Box>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default MenuNotification;
