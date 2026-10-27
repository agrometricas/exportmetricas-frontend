'use client';
import {
  Avatar,
  Box,
  Icon,
  Menu,
  Portal,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { IconType } from 'react-icons';
import { LuMoon, LuSun } from 'react-icons/lu';
import { getTopBarItems } from './MenuIconItem';
import { useColorMode } from '../color-mode';

export interface MenuItemProps {
  icon: IconType;
  label: string;
  to: string;
}

export default function MenuIcon(): React.JSX.Element {
  const { data: session } = useSession();
  const menuItems = getTopBarItems();
  const { colorMode, toggleColorMode } = useColorMode();
  const FirstIcon = menuItems[0].icon;

  if (!session) {
    return <SkeletonCircle size='9' />;
  }

  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger
        rounded='full'
        cursor='pointer'
        focusRingColor='green.focusRing'
        aria-label='Menú del usuario'
      >
        <Avatar.Root size='sm' colorPalette='green' variant='subtle'>
          <Avatar.Fallback name={session.user.name} />
        </Avatar.Root>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content minW='60'>
            <Box px='3' py='2'>
              <Text fontWeight='semibold' color='fg.heading' truncate>
                {session.user.name}
              </Text>
              <Text fontSize='sm' color='fg.muted' truncate>
                {session.user.email}
              </Text>
            </Box>
            <Menu.Separator />
            <Menu.Item value={menuItems[0].to} asChild>
              <a href={menuItems[0].to}>
                <Icon asChild>
                  <FirstIcon />
                </Icon>
                {menuItems[0].label}
              </a>
            </Menu.Item>
            <Menu.Item
              value='color-mode'
              closeOnSelect={false}
              onClick={toggleColorMode}
            >
              {colorMode === 'dark' ? <LuSun /> : <LuMoon />}
              {colorMode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            </Menu.Item>
            <Menu.Separator />
            {menuItems.slice(1).map((item) => (
              <Menu.Item key={item.to} value={item.to} asChild>
                <a href={item.to}>
                  <Icon asChild>
                    <item.icon />
                  </Icon>
                  {item.label}
                </a>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
