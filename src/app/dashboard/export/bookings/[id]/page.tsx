'use client';
import {
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Text,
  Flex,
  Separator,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdOutlineBookOnline } from 'react-icons/md';
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
  const bgColor = 'bg.canvas';
  const cardBg = 'bg.panel';
  const borderColor = 'border';
  const headingColor = 'fg.heading';
  const textColor = 'fg';

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='sm'
          overflow='hidden'
          borderWidth='1px'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <Card.Header bg={'bg.subtle'} pb={4}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.subtle' borderRadius='lg' color='green.fg'>
                <Icon boxSize={5} asChild>
                  <MdOutlineBookOnline />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Editar Booking
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Cambia la nave, el zarpe o los contenedores
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
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
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(EditBookingPage);
