'use client';

import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  Icon,
  IconButton,
  Heading,
  Text,
  Badge,
  Flex,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import Link_Next from 'next/link';
import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdOutlineBookOnline } from 'react-icons/md';
import TableBookings from '../../../../components/booking/TableBookings';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function BookingsPage(): React.JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box mb={6} maxW='8xl' mx='auto'>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align={{ base: 'stretch', md: 'center' }}
          gap={4}
        >
          <HStack spacing={3}>
            <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
              <Icon as={MdOutlineBookOnline} boxSize={5} />
            </Box>
            <Box>
              <Heading size='lg' color={headingColor} fontWeight='bold'>
                Bookings
              </Heading>
              <Text fontSize='sm' color={textColor}>
                Reservas con la naviera: nave, zarpe, ruta, contenedores y flete
              </Text>
            </Box>
          </HStack>

          <Box>
            {isMobile ? (
              <IconButton
                as={Link_Next}
                href='/dashboard/export/add-booking'
                aria-label='Agregar Booking'
                icon={<FiPlus />}
                colorScheme='green'
                size={buttonSize}
                borderRadius='lg'
                boxShadow='md'
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition='all 0.2s'
              />
            ) : (
              <Button
                as={Link_Next}
                href='/dashboard/export/add-booking'
                leftIcon={<FiPlus />}
                colorScheme='green'
                size={buttonSize}
                borderRadius='lg'
                boxShadow='md'
                fontWeight='semibold'
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition='all 0.2s'
              >
                Agregar Booking
              </Button>
            )}
          </Box>
        </Flex>
      </Box>

      <Box maxW='8xl' mx='auto'>
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
        >
          <CardBody p={0}>
            <Box
              p={6}
              bg={useColorModeValue('gray.50', 'gray.750')}
              borderBottom='1px solid'
              borderColor={borderColor}
            >
              <HStack justify='space-between' align='center'>
                <HStack spacing={3}>
                  <Text
                    fontSize='lg'
                    fontWeight='semibold'
                    color={headingColor}
                  >
                    Reservas
                  </Text>
                  <Badge
                    colorScheme='green'
                    variant='subtle'
                    borderRadius='full'
                    px={3}
                    py={1}
                  >
                    Lista actual
                  </Badge>
                </HStack>
              </HStack>
            </Box>

            <Box>
              <TableBookings />
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(BookingsPage);
