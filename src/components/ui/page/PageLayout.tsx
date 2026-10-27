'use client';
import { Box, Card, Flex, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons';

interface PageHeaderProps {
  // A server page passes the element: a component can't cross into a client one.
  icon: IconType | React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

const WIDTHS = { narrow: '5xl', wide: '8xl' } as const;

interface PageLayoutProps extends PageHeaderProps {
  width?: keyof typeof WIDTHS;
  tabs?: React.ReactNode;
  children: React.ReactNode;
}

export const PageHeader = ({
  icon,
  title,
  description,
  actions,
}: PageHeaderProps): React.JSX.Element => (
  <Flex
    direction={{ base: 'column', md: 'row' }}
    justify='space-between'
    align={{ base: 'stretch', md: 'center' }}
    gap={4}
    mb={6}
  >
    <HStack gap={4} align='center'>
      <Flex
        align='center'
        justify='center'
        boxSize={12}
        flexShrink={0}
        borderRadius='l2'
        bg='green.subtle'
        color='green.fg'
      >
        <Icon boxSize={6} asChild>
          {typeof icon === 'function' ? React.createElement(icon) : icon}
        </Icon>
      </Flex>
      <Box minW={0}>
        <Text as='h1' textStyle={{ base: 'h2', md: 'h1' }} color='fg.heading'>
          {title}
        </Text>
        {description && (
          <Text color='fg.muted' mt={1}>
            {description}
          </Text>
        )}
      </Box>
    </HStack>
    {actions && <HStack gap={3}>{actions}</HStack>}
  </Flex>
);

// The scroll area under the app bar is shorter than the viewport, so the page
// must not set a 100vh minimum height or every screen scrolls.
export const PageLayout = ({
  width = 'wide',
  tabs,
  children,
  ...header
}: PageLayoutProps): React.JSX.Element => (
  <Box p={{ base: 4, md: 6, lg: 8 }}>
    <Box maxW={WIDTHS[width]} mx='auto'>
      {tabs}
      <PageHeader {...header} />
      {children}
    </Box>
  </Box>
);

export const CardPage = ({
  width = 'narrow',
  children,
  ...header
}: PageLayoutProps): React.JSX.Element => (
  <PageLayout width={width} {...header}>
    <Card.Root boxShadow='sm'>
      <Card.Body>{children}</Card.Body>
    </Card.Root>
  </PageLayout>
);
