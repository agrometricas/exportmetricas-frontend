'use client';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Icon,
  Text,
  Divider,
  Flex,
  useColorModeValue,
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
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <CardHeader bg={useColorModeValue('gray.50', 'gray.750')} pb={4}>
            <HStack spacing={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
                <Icon as={MdOutlineBookOnline} boxSize={5} />
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
          </CardHeader>

          <Divider />

          <CardBody>
            {isLoading || !booking ? (
              <LoadingState />
            ) : (
              <Flex direction='column' gap={8}>
                <BookingForm booking={booking as BookingResponse} />
                <Divider />
                <BookingContainerSeals
                  bookingId={(booking as BookingResponse).id}
                  containers={(booking as BookingResponse).containers}
                />
                <Divider />
                <BookingDocuments
                  bookingId={(booking as BookingResponse).id}
                  containers={(booking as BookingResponse).containers}
                />
              </Flex>
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(EditBookingPage);
