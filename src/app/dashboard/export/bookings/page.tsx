'use client';
import {
  Box,
  Button,
  Card,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdOutlineBookOnline } from 'react-icons/md';
import { PageLayout } from '@/components/ui/page/PageLayout';
import TableBookings from '../../../../components/booking/TableBookings';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function BookingsPage(): React.JSX.Element {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue<'xs' | 'sm' | 'md' | 'lg'>({
    base: 'sm',
    md: 'md',
  });

  return (
    <PageLayout
      icon={MdOutlineBookOnline}
      title='Bookings'
      description='Reservas con la naviera: nave, zarpe, ruta, contenedores y flete'
      actions={
        isMobile ? (
          <IconButton
            aria-label='Agregar Booking'
            colorPalette='green'
            size={buttonSize}
            borderRadius='lg'
            asChild
          >
            <Link_Next href='/dashboard/export/add-booking'>
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
            <Link_Next href='/dashboard/export/add-booking'>
              <FiPlus />
              Agregar Booking
            </Link_Next>
          </Button>
        )
      }
    >
      <Card.Root boxShadow='sm' overflow='hidden'>
        <Card.Body p={0}>
          <Box>
            <TableBookings />
          </Box>
        </Card.Body>
      </Card.Root>
    </PageLayout>
  );
}

export default IsOnboarding(BookingsPage);
