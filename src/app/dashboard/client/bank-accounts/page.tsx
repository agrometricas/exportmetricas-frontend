'use client';
import {
  Box,
  Button,
  Card,
  IconButton,
  useBreakpointValue,
  Center,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdAccountBalance } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableBankAccounts from '../../../../components/client/table-bank-accounts/TableBankAccounts';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function BankAccountsPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdAccountBalance}
      title='Gestión de cuentas bancarias'
      description='Visualiza y administra las cuentas bancarias registradas'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar cuenta bancaria'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/client/add-bank-account'>
              <FiPlus />
            </Link_Next>
          </IconButton>
        ) : (
          <Button
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            fontWeight='semibold'
            asChild
          >
            <Link_Next href='/dashboard/client/add-bank-account'>
              <FiPlus />
              Agregar cuenta bancaria
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <Center>
              <TableBankAccounts />
            </Center>
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(BankAccountsPage);
