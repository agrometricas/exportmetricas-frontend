'use client';
import {
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Text,
  Separator,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineBookOnline } from 'react-icons/md';
import BookingForm from '../../../../components/booking/BookingForm';
import { useColorModeValue } from '../../../../components/ui/color-mode';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddBookingPage(): React.JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box minH='100vh' w='100%' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='8xl' mx='auto'>
        <Card.Root
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
          borderTopWidth='4px'
          borderTopColor='green.500'
        >
          <Card.Header bg={useColorModeValue('gray.50', 'gray.750')} pb={4}>
            <HStack gap={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
                <Icon boxSize={5} asChild>
                  <MdOutlineBookOnline />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Agregar Booking
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Reserva con la naviera: el precio sale del contrato vigente el
                  día del zarpe
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            <BookingForm />
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(AddBookingPage);
