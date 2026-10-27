'use client';
import {
  Avatar,
  Box,
  Heading,
  IconButton,
  Menu,
  Text,
  Icon,
  HStack,
  SkeletonCircle,
  Portal,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { AiOutlineUser } from 'react-icons/ai';
import { getTopBarItems } from './MenuIconItem';
import { useColorModeValue } from "../color-mode";

export interface MenuItemProps {
  icon: IconType;
  label: string;
  to: string;
}

export default function MenuIcon(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const menuItems = getTopBarItems();

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  React.useEffect(() => {
    if (session) {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <SkeletonCircle


        size='12'
        mr='8px'
      />
    );
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild><IconButton
          bg='green.500'
          h='50px'
          w='50px'
          aria-label='user-pic'
          rounded='full'
          color='white'
          transition='all 0.2s'
          _hover={{
            bg: 'green.600',
            transform: 'scale(1.05)',
            boxShadow: `0 4px 12px rgba(34, 197, 94, 0.4)`,
          }}
          _active={{
            bg: 'green.700',
            transform: 'scale(0.95)',
          }}
          border='2px solid'
          borderColor='green.400'><AiOutlineUser size='30px' /></IconButton></Menu.Trigger>

      <Portal><Menu.Positioner><Menu.Content>
            <Box p={4}>
              <HStack gap={3}>
                <Avatar.Root
                  bg='green.500'
                  h='44px'
                  w='44px'
                  aria-label='user-pic'
                  rounded='full'
                  color='white'
                  border='2px solid'
                  borderColor='green.400'><Avatar.Fallback>{<AiOutlineUser size='24px' />}</Avatar.Fallback></Avatar.Root>
                <Box flex={1} mr={4}>
                  <Heading
                    fontSize='md'
                    fontWeight='semibold'
                    color={textColor}
                    lineClamp={1}
                  >
                    {session?.user.name}
                  </Heading>
                  <Text
                    fontSize='sm'
                    color={"gray.500"}
                    lineClamp={1}
                  >
                    {session?.user.email}
                  </Text>
                </Box>
              </HStack>
            </Box>

            <Menu.Separator borderColor={borderColor} />

            <Menu.ItemGroup>
              {menuItems.map((item) => (
                <Menu.Item
                  key={item.to}
                  alignItems='flex-start'
                  px='12px'
                  py='10px'
                  mx='6px'
                  borderRadius='lg'
                  transition='all 0.2s ease'
                  _hover={{
                    bg: hoverBg,
                    transform: 'translateX(4px)',
                  }}
                  value={item.to}
                  asChild><a href={item.to}>
                    <HStack gap={3}>
                      <Box p={2} borderRadius='lg' bg={hoverBg} color={textColor}>
                        <Icon boxSize={4} asChild><item.icon /></Icon>
                      </Box>
                      <Text fontWeight='medium' color={textColor} fontSize='sm'>
                        {item.label}
                      </Text>
                    </HStack>
                  </a></Menu.Item>
              ))}
            </Menu.ItemGroup>
          </Menu.Content></Menu.Positioner></Portal>
    </Menu.Root>
  );
}
