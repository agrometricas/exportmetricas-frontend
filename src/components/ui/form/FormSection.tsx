import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface FormSectionTitleProps {
  children: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  // For a section that opens its own container but follows another one.
  divider?: boolean;
}

const DIVIDER = { mt: 6, pt: 6, borderTopWidth: '1px' };

export const FormSectionTitle = ({
  children,
  description,
  actions,
  divider,
}: FormSectionTitleProps): React.JSX.Element => (
  <Flex
    align='center'
    justify='space-between'
    wrap='wrap'
    gap={3}
    mb={2}
    css={divider ? DIVIDER : { '&:not(:first-of-type)': DIVIDER }}
  >
    <Box>
      <Text as='h2' textStyle='h3' color='fg.heading'>
        {children}
      </Text>
      {description && (
        <Text textStyle='caption' color='fg.muted' mt={1}>
          {description}
        </Text>
      )}
    </Box>
    {actions}
  </Flex>
);

export const FormSubsectionTitle = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => (
  <Text as='h3' textStyle='md' fontWeight='semibold' color='fg.heading' mt={2}>
    {children}
  </Text>
);

export const FormActions = ({
  start,
  children,
}: {
  start?: React.ReactNode;
  children: React.ReactNode;
}): React.JSX.Element => (
  <Flex
    position='sticky'
    bottom={0}
    zIndex='docked'
    justify='flex-end'
    wrap='wrap'
    gap={3}
    mt={6}
    py={4}
    bg='bg.panel'
    borderTopWidth='1px'
  >
    {start && <Box me='auto'>{start}</Box>}
    {children}
  </Flex>
);
