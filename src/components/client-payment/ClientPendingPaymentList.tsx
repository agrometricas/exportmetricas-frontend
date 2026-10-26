'use client';

import {
  Badge,
  Box,
  Heading,
  SimpleGrid,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import PendingPaymentCard from './PendingPaymentCard';
import { useClientPaymentsPending } from '../../hooks/client-payment/getClientPaymentPending';
import { usePagination } from '../../hooks/usePagination';
import { ExportSentType } from '../../types/exportSent';

type ApiErrorData = {
  statusCode?: number;
  message?: string;
  error?: string;
};

const PendingPaymentList = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], isLoading, error, refetch } = useClientPaymentsPending(paginationParams);

  const router = useRouter();
  const pathname = usePathname();

  const headingColor = useColorModeValue('gray.900', 'gray.100');

  useEffect(() => {
    if (error && isAxiosError<ApiErrorData>(error)) {
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <LoadingState minH='40vh' />
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const items = data as Partial<ExportSentType>[];

  return (
    <VStack spacing={4} align="stretch">
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        justifyContent="space-between"
        w="100%"
      >
        <Heading size="md" color={headingColor}>
          Cobros Pendientes
        </Heading>
        <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
          {items.length} {items.length === 1 ? 'pendiente' : 'pendientes'}
        </Badge>
      </Box>

      {items.length === 0 ? (
        <EmptyState
            title="No hay cobros pendientes"
            description="Un envío aparece aquí cuando sus costos están validados."
          />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={{ base: 4, md: 6 }}>
          {items.map((item) => (
            <PendingPaymentCard key={item.id} exportSentItem={item} pathname={pathname} />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default PendingPaymentList;
