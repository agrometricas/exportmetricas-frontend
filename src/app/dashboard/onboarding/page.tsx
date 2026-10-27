'use client';
import { Box, Card, Center, Heading } from '@chakra-ui/react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useLayoutEffect } from 'react';
import OnboardingForm from '../../../components/onboarding/OnboardingForm';

export default function OnBoardingPage(): React.JSX.Element {
  const { data: session } = useSession();
  const isOnboarded = session?.user?.onboardingStatus;

  useLayoutEffect(() => {
    if (isOnboarded === 'done') {
      return redirect('/dashboard');
    }
  }, [isOnboarded]);

  return (
    <>
      <Box my={'20px'} mx={'auto'} w={'95%'}>
        <Center>
          <Card.Root
            w={{
              base: '95%',
              sm: '95%',
              md: '90%',
              lg: '100%',
              xl: '100%',
            }}
            mb={'20px'}
          >
            <Card.Header w={'100%'}>
              <Heading>Registro Inicial</Heading>
            </Card.Header>
            <Card.Body w='100%'>
              <OnboardingForm />
            </Card.Body>
          </Card.Root>
        </Center>
      </Box>
    </>
  );
}
