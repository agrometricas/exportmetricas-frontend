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
import { MdAgriculture } from 'react-icons/md';
import LoadingState from '@/components/ui/states/LoadingState';
import EditBusinessForm from '../../../../../components/business/edit/EditBusinessForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useBusiness } from '../../../../../hooks/business/getBusiness';
import { BusinessDetail } from '../../../../../types/merchant/businessDetail';

function EditBusinessPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useBusiness({ businessId: id });
  const business = data as unknown as BusinessDetail | undefined;
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
                <Icon as={MdAgriculture} boxSize={5} />
              </Box>
              <Box>
                <Heading size='lg' color={headingColor} fontWeight='bold'>
                  Editar Finca
                </Heading>
                <Text fontSize='sm' color={textColor} mt={1}>
                  Datos, ubicación, códigos, contactos y certificados de la
                  finca
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <Divider />

          <CardBody>
            {isLoading || !business ? (
              <LoadingState />
            ) : (
              <EditBusinessForm business={business} />
            )}
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(EditBusinessPage);
