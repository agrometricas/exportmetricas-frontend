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
import { AxiosError } from 'axios';
import { redirect, useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import LoadingState from '@/components/ui/states/LoadingState';
import ClientPendingPaymentForm from '../../../../../components/client-payment/ClientPendingPaymentForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExportSent } from '../../../../../hooks/export/export-sent/getExportSent';
import { ExportSentType } from '../../../../../types/exportSent';

function ClientPaymentPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useExportSent({
    exportSentId: params.id,
  });
  const pendingClientPayment = data as Partial<ExportSentType>;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (error && (error as AxiosError).isAxiosError) {
      const { response } = error as AxiosError<{
        statusCode: number;
      }>;

      const statusCode = response?.data?.statusCode;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!pendingClientPayment || pendingClientPayment.pendingClientPayment) {
        return redirect(pathname.replace(/\/\d+$/, ''));
      }
    }
  }, [isLoading, pendingClientPayment, pathname]);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const grayColor = useColorModeValue('green.50', 'green.750');

  if (isLoading) {
    return (
      <LoadingState minH='60vh' />
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6, lg: 8 }}>
      <Box maxW="8xl" mx="auto">
        <Card
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          borderTopWidth="4px"
          borderTopColor="green.500"
        >
          <CardHeader bg={grayColor} pb={4}>
            <HStack spacing={3} align="center">
              <Box p={2} bg="green.100" borderRadius="lg" color="green.600">
                <Icon as={FiCreditCard} boxSize={5} />
              </Box>
              <Box>
                <Heading size="lg" color={headingColor} fontWeight="bold">
                  Cobro a Clientes
                </Heading>
                <Text fontSize="sm" color={textColor} mt={1}>
                  Registra y confirma el cobro del envío seleccionado
                </Text>
              </Box>
            </HStack>
          </CardHeader>

          <Divider />

          <CardBody>
            <ClientPendingPaymentForm
              paymentSelected={pendingClientPayment}
              pathname={pathname}
            />
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}

export default IsOnboarding(ClientPaymentPage);
