'use client';

import {
  Badge,
  Box,
  Center,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { useExportsSentPending } from '../../../hooks/export/export-sent/getExportsSentPending';
import { usePagination } from '../../../hooks/usePagination';
import { ExportSentType } from '../../../types/exportSent';
import OpenWithConfirmation from '../../ui/OpenWithConfirmation';
import PendingTable from '../../ui/PendingTable';
import { pendingExportColumns } from '../pendingColumns';

type ApiErrorData = {
  statusCode?: number;
  message?: string;
  error?: string;
};

const PendingPaymentList = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], isLoading, error } = useExportsSentPending(paginationParams);
  const router = useRouter();
  const pathname = usePathname();
  const columns = useMemo(
    () => pendingExportColumns<Partial<ExportSentType>>((row) => row.export),
    []
  );

  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.300');

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
      <Box minH="40vh" display="flex" alignItems="center" justifyContent="center">
        <Heading>Cargando...</Heading>
      </Box>
    );
  }

  if (error) {
    if (isAxiosError<ApiErrorData>(error)) {
      const { statusCode, message, error: errorTitle } = error.response?.data ?? {};
      return (
        <Box minH="40vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={2} align="center">
            <Heading>
              {statusCode ?? 'Error'}
              {errorTitle ? ` - ${errorTitle}` : ''}
            </Heading>
            <Text color={textColor}>{message ?? 'Ocurrió un error inesperado'}</Text>
          </VStack>
        </Box>
      );
    }
    return (
      <Box minH="40vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={2} align="center">
          <Heading>Error</Heading>
          <Text color={textColor}>Ocurrió un error inesperado</Text>
        </VStack>
      </Box>
    );
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
          Pagos Pendientes
        </Heading>
        <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
          {items.length} {items.length === 1 ? 'pendiente' : 'pendientes'}
        </Badge>
      </Box>

      {items.length === 0 ? (
        <Center py={10}>
          <VStack spacing={1}>
            <Heading size="sm" color={headingColor}>
              No existen pagos pendientes
            </Heading>
            <Text fontSize="sm" color={textColor}>
              Cuando existan, aparecerán aquí.
            </Text>
          </VStack>
        </Center>
      ) : (
        <PendingTable
          columns={columns}
          data={items}
          rowId={(item) => Number(item.id)}
          renderAction={(item) => (
            <OpenWithConfirmation
              href={`${pathname}/${item.id}`}
              label='Realizar pago'
              title={`Abrir Pago Pendiente: ${item.export?.merchant?.businessName || '—'}`}
              description='¿Estás seguro de que deseas empezar este Pago Pendiente?'
            />
          )}
        />
      )}
    </VStack>
  );
};

export default PendingPaymentList;
