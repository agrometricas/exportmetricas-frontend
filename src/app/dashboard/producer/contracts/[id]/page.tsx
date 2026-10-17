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
import { useParams } from 'next/navigation';
import React from 'react';
import { MdOutlineAssignment } from 'react-icons/md';
import ProducerContractForm from '../../../../../components/producer-contract/ProducerContractForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useProducerContract } from '../../../../../hooks/producer-contract/getProducerContract';
import { ProducerContractResponse } from '../../../../../types/producerContract';

function EditProducerContractPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data: contract, isLoading } = useProducerContract(id);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box minH="100vh" w="100%" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="8xl" mx="auto">
        <Card
          bg={cardBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          border="1px solid"
          borderTopWidth="4px"
          borderTopColor="green.500"
        >
          <CardHeader bg={useColorModeValue('gray.50', 'gray.750')} pb={4}>
            <HStack spacing={3} align="center">
              <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
                <Icon as={MdOutlineAssignment} boxSize={5} />
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Editar Contrato de Productor
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Cambia el cupo o la vigencia del contrato
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <Divider />

          <CardBody>
            {isLoading || !contract ? (
              <Text>Cargando...</Text>
            ) : (
              <ProducerContractForm contract={contract as ProducerContractResponse} />
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(EditProducerContractPage);
