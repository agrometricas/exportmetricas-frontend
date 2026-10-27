'use client';
import { Flex, Separator } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdOutlineBookOnline } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import BookingContainerSeals from '../../../../../components/booking/BookingContainerSeals';
import BookingDocuments from '../../../../../components/booking/BookingDocuments';
import BookingForm from '../../../../../components/booking/BookingForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useBooking } from '../../../../../hooks/booking/getBooking';
import { BookingResponse } from '../../../../../types/booking';

function EditBookingPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: booking, isLoading } = useBooking(id);

  return (
    <CardPage
      icon={MdOutlineBookOnline}
      title='Editar Booking'
      description='Cambia la nave, el zarpe o los contenedores'
      width='wide'
    >
      {isLoading || !booking ? (
        <LoadingState />
      ) : (
        <Flex direction='column' gap={8}>
          <BookingForm booking={booking as BookingResponse} />
          <Separator />
          <BookingContainerSeals
            bookingId={(booking as BookingResponse).id}
            containers={(booking as BookingResponse).containers}
          />
          <Separator />
          <BookingDocuments
            bookingId={(booking as BookingResponse).id}
            containers={(booking as BookingResponse).containers}
          />
        </Flex>
      )}
    </CardPage>
  );
}

export default IsOnboarding(EditBookingPage);
