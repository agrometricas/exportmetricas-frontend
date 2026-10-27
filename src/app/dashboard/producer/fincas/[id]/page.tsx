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
                  <MdAgriculture />
                </Icon>
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
          </Card.Header>

          <Separator />

          <Card.Body>
            {isLoading || !business ? (
              <LoadingState />
            ) : (
              <EditBusinessForm business={business} />
            )}
          </Card.Body>
        </Card.Root>
      </Box>
    </Box>
  );
}

export default IsOnboarding(EditBusinessPage);
