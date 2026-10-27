import { Box, DataList, Text } from '@chakra-ui/react';
import React from 'react';

export const DetailFields = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => (
  <DataList.Root
    orientation='vertical'
    size='sm'
    display='grid'
    gridTemplateColumns='repeat(auto-fill, minmax(160px, 1fr))'
    columnGap={6}
    rowGap={4}
    css={{ '& + &': { mt: 4 } }}
  >
    {children}
  </DataList.Root>
);

const isEmpty = (value: React.ReactNode): boolean =>
  value === null || value === undefined || value === '' || value === false;

export const DetailField = ({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}): React.JSX.Element => (
  <DataList.Item>
    <DataList.ItemLabel fontSize='xs' lineHeight='16px' fontWeight='medium'>
      {label}
    </DataList.ItemLabel>
    <DataList.ItemValue
      color='fg'
      fontSize='sm'
      lineHeight='21px'
      overflowWrap='anywhere'
    >
      {isEmpty(children) ? '—' : children}
    </DataList.ItemValue>
  </DataList.Item>
);

export const DetailSubtitle = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => (
  <Text textStyle='overline' color='fg.muted' mt={5} mb={2}>
    {children}
  </Text>
);

// One of several records in a detail (a farm, a contact, an account): a line
// separates it from the one before.
export const DetailItem = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => (
  <Box css={{ '& + &': { mt: 4, pt: 4, borderTopWidth: '1px' } }}>
    {children}
  </Box>
);
