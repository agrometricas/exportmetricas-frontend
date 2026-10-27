'use client';
import { Container, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import React from 'react';

export const SignInButton = (): React.JSX.Element => {
  const { data: session } = useSession();

  if (session && session.user)
    return (
      <>
        <Container backgroundColor={'gray.200'}>
          <Text color='navy.400'>{session?.user?.name}</Text>
          <Link color={'green.fg'} asChild>
            <NextLink href={'/api/auth/signout'}>Sign Out</NextLink>
          </Link>
        </Container>
      </>
    );

  return (
    <Container backgroundColor={'gray.200'}>
      <Link color={'red.fg'} asChild>
        <NextLink href={'/api/auth/signin'}>Sign in</NextLink>
      </Link>
      <Link color={'green.fg'} asChild>
        <NextLink href={'/signup'}>Sign up</NextLink>
      </Link>
    </Container>
  );
};
