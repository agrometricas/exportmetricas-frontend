'use client';

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { MdAttachMoney } from 'react-icons/md';
import MinimumBoxPriceForm from '../../../../components/settings/minimum-box-price/MinimumBoxPriceForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function MinimumBoxPricePage(): React.JSX.Element {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headBg = useColorModeValue('gray.50', 'gray.750');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box minH='100vh' bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW='7xl' mx='auto'>
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius='xl'
          boxShadow='lg'
          overflow='hidden'
          border='1px solid'
        >
          <CardHeader bg={headBg}>
            <HStack spacing={3} align='center'>
              <Box p={2} bg='green.100' borderRadius='lg' color='green.600'>
                <Icon as={MdAttachMoney} boxSize={5} />
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Precio Mínimo
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Precio mínimo de sustentación por caja que se le propone al
                  productor.
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <CardBody>
            <MinimumBoxPriceForm />
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(MinimumBoxPricePage);
