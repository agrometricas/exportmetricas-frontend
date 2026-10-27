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
import { MdPeopleOutline } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableClients from '../../../../components/client/table-client/TableClients';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function ClientsPage(): React.JSX.Element {
  // Responsive
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdPeopleOutline}
      title='Gestión de clientes'
      description='Visualiza y administra los clientes registrados'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar cliente'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/client/add-client'>
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
            <Link_Next href='/dashboard/client/add-client'>
              <FiPlus />
              Agregar cliente
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <Center>
              <TableClients />
            </Center>
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(ClientsPage);
