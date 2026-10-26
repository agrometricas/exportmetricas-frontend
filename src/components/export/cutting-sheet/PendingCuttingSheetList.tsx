'use client';
import {
  Box,
  Center,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import CuttingSheetBatchPanel from './CuttingSheetBatchPanel';
import PendingCuttingSheetCard from './PendingCuttingSheetCard';
import { useCuttingSheetsPending } from '../../../hooks/export/cuttingSheet/getExportsSentPending';
import { usePagination } from '../../../hooks/usePagination';
import { PendingSheet } from '../../../types/cuttingSheetBatch';
import { ExportType } from '../../../types/export';

type ApiErrorData = {
  statusCode?: number;
  message?: string;
  error?: string;
};

const PendingCuttingSheetList = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const {
    data = [],
    isLoading,
    error,
  } = useCuttingSheetsPending(paginationParams);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (error && isAxiosError<ApiErrorData>(error)) {
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.300');

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
              {statusCode ?? 'Error'}{errorTitle ? ` - ${errorTitle}` : ''}
            </Heading>
            <Text>{message ?? 'Ocurrió un error inesperado'}</Text>
          </VStack>
        </Box>
      );
    }

    return (
      <Box minH="40vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={2} align="center">
          <Heading>Error</Heading>
          <Text>Ocurrió un error inesperado</Text>
        </VStack>
      </Box>
    );
  }

  const items = data as Partial<ExportType>[];

  return (
    <VStack spacing={4} align="stretch">
      <Box display="flex" alignItems="center" gap={3} justifyContent="space-between" w="100%">
        <Heading size="md" color={headingColor}>Lista de Cortes Pendientes</Heading>
        <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
          {items.length} {items.length === 1 ? 'pendiente' : 'pendientes'}
        </Badge>
      </Box>

      <CuttingSheetBatchPanel items={items as unknown as PendingSheet[]} />

      {items.length === 0 ? (
        <Center py={10}>
          <VStack spacing={1}>
            <Heading size="sm" color={headingColor}>No existen hojas de corte pendientes</Heading>
            <Text fontSize="sm" color={textColor}>Cuando existan, aparecerán aquí.</Text>
          </VStack>
        </Center>
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          spacing={{ base: 4, md: 6 }}
        >
          {items.map((item) => (
            <PendingCuttingSheetCard
              key={item?.id}
              exportItem={item}
              pathname={pathname}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default PendingCuttingSheetList;
