/* eslint-disable @typescript-eslint/no-explicit-any */
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
import React, { useEffect, useState } from 'react';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import ExportCard from './ExportCard';
import ShipmentBatchBar from './ShipmentBatchBar';
import { useExportsPending } from '../../hooks/export/getExportsPending';
import { usePagination } from '../../hooks/usePagination';
import { ExportType } from '../../types/export';
import { toggleId } from '../../utils/selection';

type ApiErrorData = {
  statusCode?: number;
  message?: string;
  error?: string;
};

const ExportList = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], isLoading, error, refetch } = useExportsPending(paginationParams);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  const items = data as Partial<ExportType>[];
  const canBatch = items.length > 1;
  const visibleSelected = selectedIds.filter((id) =>
    items.some((item) => Number(item.id) === id)
  );

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
          Exportaciones Pendientes
        </Heading>
        <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
          {items.length} {items.length === 1 ? 'pendiente' : 'pendientes'}
        </Badge>
      </Box>

      {items.length > 0 && (
        <ShipmentBatchBar
          items={items}
          selectedIds={visibleSelected}
          onSelectedChange={setSelectedIds}
        />
      )}

      {items.length === 0 ? (
        <EmptyState
            title="No hay exportaciones pendientes de envío"
            description="Cada exportación nueva aparece aquí para registrar sus insumos."
          />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={{ base: 4, md: 6 }}>
          {items.map((item) => (
            <ExportCard
              key={item.id}
              exportItem={item}
              pathname={pathname}
              isSelected={visibleSelected.includes(Number(item.id))}
              onToggleSelected={
                canBatch
                  ? (): void =>
                      setSelectedIds((ids) => toggleId(ids, Number(item.id)))
                  : undefined
              }
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default ExportList;
