'use client';
import React from 'react';
import { MdOutlineBookOnline } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import BookingForm from '../../../../components/booking/BookingForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBookingPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineBookOnline}
      title='Agregar Booking'
      description='Reserva con la naviera: el precio sale del contrato vigente el día del zarpe'
    >
      <BookingForm />
    </CardPage>
  );
}

export default IsOnboarding(AddBookingPage);
