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
import { useParams } from 'next/navigation';
import React from 'react';
import { MdDirectionsBoat } from 'react-icons/md';
import LoadingState from '@/components/ui/states/LoadingState';
import ShippingContractForm from '../../../../../components/shipping-contract/ShippingContractForm';
import { useColorModeValue } from '../../../../../components/ui/color-mode';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useShippingContract } from '../../../../../hooks/shipping-contract/getShippingContract';
import { ShippingContractResponse } from '../../../../../types/shippingContract';

function EditShippingContractPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: contract, isLoading } = useShippingContract(id);
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
                  <MdDirectionsBoat />
                </Icon>
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Editar Contrato Naviero
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Cambia las rutas, los costos o la vigencia del contrato
                </Text>
              </Box>
            </HStack>
          </Card.Header>

          <Separator />

          <Card.Body>
            {isLoading || !contract ? (
              <LoadingState />
            ) : (
              <ShippingContractForm
                contract={contract as ShippingContractResponse}
              />
            )}
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(EditShippingContractPage);
