'use client';

import {
  Badge,
  Box,
  Heading,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import { useClientPaymentsPending } from '../../hooks/client-payment/getClientPaymentPending';
import { usePagination } from '../../hooks/usePagination';
import { ExportSentType } from '../../types/exportSent';
import { pendingExportColumns } from '../export/pendingColumns';
import OpenWithConfirmation from '../ui/OpenWithConfirmation';
import PendingTable from '../ui/PendingTable';

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
  const columns = useMemo(
    () => pendingExportColumns<Partial<ExportSentType>>((row) => row.export),
    []
  );

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
        <PendingTable
          columns={columns}
          data={items}
          rowId={(item) => Number(item.id)}
          renderAction={(item) => (
            <OpenWithConfirmation
              href={`${pathname}/${item.id}`}
              label='Realizar cobro'
              title={`Abrir Cobro Pendiente: ${item.export?.client?.businessName || '—'}`}
              description='¿Estás seguro de que deseas empezar este Cobro Pendiente?'
            />
          )}
        />
      )}
    </VStack>
  );
};

export default PendingPaymentList;
