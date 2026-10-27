'use client';
import { Box, Card, Center } from '@chakra-ui/react';
import React from 'react';
import AddBrandForm from '../../../../components/box-brands/specifications/brand/AddBrandForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBrandPage(): React.JSX.Element {
  return (
    <>
      <Box my={'auto'} mx={'auto'}>
        <Center>
          <Card.Root
            w={{
              base: '95%',
              sm: '95%',
              md: '90%',
              lg: '600px',
              xl: '600px',
              '2xl': '700px',
            }}
          >
            <Card.Body w='100%'>
              <AddBrandForm />
            </Card.Body>
          </Card.Root>
        </Center>
      </Box>
    </>
  );
}

export default IsOnboarding(AddBrandPage);
