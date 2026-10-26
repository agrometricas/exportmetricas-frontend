'use client';
import {
  Box,
  Heading,
  VStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import CuttingSheetBatchPanel from './CuttingSheetBatchPanel';
import { useCuttingSheetsPending } from '../../../hooks/export/cuttingSheet/getExportsSentPending';
import { usePagination } from '../../../hooks/usePagination';
import { PendingSheet } from '../../../types/cuttingSheetBatch';
import { ExportType } from '../../../types/export';
import { ExportSentType } from '../../../types/exportSent';
import OpenWithConfirmation from '../../ui/OpenWithConfirmation';
import PendingTable from '../../ui/PendingTable';
import { pendingExportColumns } from '../pendingColumns';

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
    refetch,
  } = useCuttingSheetsPending(paginationParams);

  const router = useRouter();
  const pathname = usePathname();
  const columns = useMemo(
    () => pendingExportColumns<Partial<ExportSentType>>((row) => row.export),
    []
  );

  useEffect(() => {
    if (error && isAxiosError<ApiErrorData>(error)) {
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  const headingColor = useColorModeValue('gray.900', 'gray.100');

  if (isLoading) {
    return (
      <LoadingState minH='40vh' />
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
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
        <EmptyState
            title="No hay hojas de corte pendientes"
            description="Cada envío de insumos registrado aparece aquí para generar su hoja."
          />
      ) : (
        <PendingTable
          columns={columns}
          data={items as unknown as Partial<ExportSentType>[]}
          rowId={(item) => Number(item.id)}
          renderAction={(item) => (
            <OpenWithConfirmation
              href={`${pathname}/${item.export?.id ?? item.id}`}
              label='Realizar hoja de corte'
              title={`Abrir hoja de corte para: ${item.export?.merchant?.businessName || '—'} — ${item.export?.client?.businessName || '—'}`}
              description='¿Estás seguro de que deseas empezar esta Hoja de Corte?'
            />
          )}
        />
      )}
    </VStack>
  );
};

export default PendingCuttingSheetList;
