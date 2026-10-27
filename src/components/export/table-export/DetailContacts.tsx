import { Heading, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';
import { ContactType } from '../../../types/merchant/contact';

const DetailContacts = ({
  businessContacts,
}: {
  businessContacts: Partial<ContactType>[];
}): React.JSX.Element => {
  return (
    <>
      <SimpleGrid columns={4} gap={0} mb={'5px'}>
        <Heading fontSize={'md'} fontWeight={'bold'}>
          Nombre:{' '}
        </Heading>
        <Heading fontSize={'md'} fontWeight={'bold'}>
          Telefono:{' '}
        </Heading>
        <Heading fontSize={'md'} fontWeight={'bold'}>
          Rol:{' '}
        </Heading>
        <Heading fontSize={'md'} fontWeight={'bold'}>
          Email:{' '}
        </Heading>
      </SimpleGrid>
      {businessContacts.map((contact, index) => (
        <SimpleGrid key={index} columns={4} gap={0}>
          <Text as={'span'} fontWeight={'normal'} display={'block'}>
            {contact.name}
          </Text>
          <Text as={'span'} fontWeight={'normal'} display={'block'}>
            {contact.phone}
          </Text>
          <Text as={'span'} fontWeight={'normal'} display={'block'}>
            {contact.role}
          </Text>
          <Text as={'span'} fontWeight={'normal'} display={'block'}>
            {contact.email ?? 'No agregado'}
          </Text>
        </SimpleGrid>
      ))}
    </>
  );
};

export default DetailContacts;
