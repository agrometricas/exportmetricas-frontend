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
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { MdDirectionsBoat } from 'react-icons/md';
import ShippingContractForm from '../../../../components/shipping-contract/ShippingContractForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddShippingContractPage(): React.JSX.Element {
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
                <Icon as={MdDirectionsBoat} boxSize={5} />
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Agregar Contrato Naviero
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Registra las rutas de una naviera con su costo por contenedor
                  y vigencia
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <Divider />

          <CardBody>
            <ShippingContractForm />
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(AddShippingContractPage);
