'use client';
import {
  Avatar,
  Box,
  Heading,
  IconButton,
  Menu,
  Text,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Icon,
  useColorModeValue,
  HStack,
  SkeletonCircle,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { AiOutlineUser } from 'react-icons/ai';
import { getTopBarItems } from './MenuIconItem';

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
  const shadowColor = useColorModeValue(
    'rgba(0, 0, 0, 0.1)',
    'rgba(0, 0, 0, 0.3)'
  );

  React.useEffect(() => {
    if (session) {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <SkeletonCircle
        startColor='teal.500'
        endColor='teal.800'
        size='12'
        mr='8px'
      />
    );
  }

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        bg='green.500'
        h='50px'
        w='50px'
        aria-label='user-pic'
        rounded='full'
        icon={<AiOutlineUser size='30px' />}
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
        borderColor='green.400'
      />

      <MenuList
        minW='360px'
        bg={"white"}
        border='1px solid'
        borderColor={borderColor}
        borderRadius='xl'
        boxShadow={`0 24px 48px ${shadowColor}`}
        p='0'
        overflow='hidden'
      >
        <Box p={4}>
          <HStack spacing={3}>
            <Avatar
              bg='green.500'
              h='44px'
              w='44px'
              aria-label='user-pic'
              rounded='full'
              icon={<AiOutlineUser size='24px' />}
              color='white'
              border='2px solid'
              borderColor='green.400'
            />
            <Box flex={1} mr={4}>
              <Heading
                fontSize='md'
                fontWeight='semibold'
                color={textColor}
                noOfLines={1}
              >
                {session?.user.name}
              </Heading>
              <Text
                fontSize='sm'
                color={"gray.500"}
                noOfLines={1}
              >
                {session?.user.email}
              </Text>
            </Box>
          </HStack>
        </Box>

        <MenuDivider borderColor={borderColor} />

        <MenuOptionGroup>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              as='a'
              href={item.to}
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
            >
              <HStack spacing={3}>
                <Box p={2} borderRadius='lg' bg={hoverBg} color={textColor}>
                  <Icon as={item.icon} boxSize={4} />
                </Box>
                <Text fontWeight='medium' color={textColor} fontSize='sm'>
                  {item.label}
                </Text>
              </HStack>
            </MenuItem>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
