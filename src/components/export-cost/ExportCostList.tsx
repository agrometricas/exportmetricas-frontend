'use client';

import {
  Box,
  Center,
  Heading,
  Text,
  VStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { MRT_ColumnDef } from 'material-react-table';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { MdFactCheck } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import {
  COST_CONFIRMATION_QUERIES,
  useConfirmExportSentCosts,
} from '../../hooks/export/export-sent/confirmExportSentCostReview';
import { useExportSentCostsPending } from '../../hooks/export/export-sent/getExportSentCostsPending';
import { usePagination } from '../../hooks/usePagination';
import { ExportSentType } from '../../types/exportSent';
import { costBatchSummary, formatUsd } from '../../utils/costBatch';
import {
  pendingExportColumns,
  pendingExportLabel,
} from '../export/pendingColumns';
import BatchActionBar from '../ui/BatchActionBar';
import OpenWithConfirmation from '../ui/OpenWithConfirmation';
import PendingTable from '../ui/PendingTable';

type PendingCost = Partial<ExportSentType>;

const costLabel = (item: PendingCost): string =>
  [
    pendingExportLabel(item.export),
    item.materialsCost !== undefined ? formatUsd(item.materialsCost) : '',
  ]
    .filter(Boolean)
    .join(' · ');

type ApiErrorData = {
  statusCode?: number;
  message?: string;
  error?: string;
};

const ExportCostList = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], isLoading, error } = useExportSentCostsPending(paginationParams);

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { mutateAsync, isLoading: isConfirming } = useConfirmExportSentCosts();
  const columns = useMemo<MRT_ColumnDef<PendingCost>[]>(
    () => [
      ...pendingExportColumns<PendingCost>((row) => row.export),
      {
        id: 'materialsCost',
        header: 'Costo de materiales',
        accessorFn: (row) =>
          row.materialsCost === undefined
            ? ''
            : `${formatUsd(row.materialsCost)} · ${row.materialLines} ${row.materialLines === 1 ? 'material' : 'materiales'}`,
      },
    ],
    []
  );

  // Once per visit: paginationParams is a new object on every render, and
  // depending on it refetched the list in a loop.
  useEffect(() => {
    queryClient.invalidateQueries('exportSentCostsPending');
  }, [queryClient]);

  const headingColor = useColorModeValue('gray.900', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  useEffect(() => {
    if (error && isAxiosError<ApiErrorData>(error)) {
      const statusCode = error.response?.data?.statusCode;
      if (statusCode === 401) router.push('/api/auth/signout');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <Box minH="40vh" display="flex" alignItems="center" justifyContent="center">
        <Heading size="md">Cargando...</Heading>
      </Box>
    );
  }

  if (error) {
    if (isAxiosError<ApiErrorData>(error)) {
      const { statusCode, message, error: errorTitle } = error.response?.data ?? {};
      return (
        <Box minH="40vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={2} align="center">
            <Heading size="md">
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
          <Heading size="md">Error</Heading>
          <Text color={textColor}>Ocurrió un error inesperado</Text>
        </VStack>
      </Box>
    );
  }

  const items = data as PendingCost[];
  const selected = items.filter((item) =>
    selectedIds.includes(Number(item.id))
  );

  return (
    <VStack spacing={4} align="stretch">
      <Box display="flex" alignItems="center" gap={3} justifyContent="space-between" w="100%">
        <Heading size="md" color={headingColor}>
          Costos de Exportación Pendientes
        </Heading>
        <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
          {items.length} {items.length === 1 ? 'pendiente' : 'pendientes'}
        </Badge>
      </Box>

      {items.length > 0 && (
        <BatchActionBar
          selected={selected}
          keyOf={(item) => Number(item.id)}
          labelOf={costLabel}
          hint='Elige en la tabla los envíos cuyos costos no hay que corregir y confírmalos juntos. Para cambiar un costo, ábrelo con Revisar costos.'
          icon={<MdFactCheck />}
          actionLabel='Confirmar costos'
          confirmTitle='Confirmar los costos'
          confirmText={(count) =>
            `Se confirman los costos de ${count === 1 ? '1 envío' : `${count} envíos`} tal como están. Después de confirmados ya no se corrigen y pasan a pago al productor y cobro al cliente.`
          }
          confirmLabel={(count) =>
            `Confirmar ${count === 1 ? '1 envío' : `${count} envíos`}`
          }
          failuresTitle='Quedaron sin confirmar'
          errorTitle='No se pudieron confirmar los costos'
          affectedQueries={COST_CONFIRMATION_QUERIES}
          isRunning={isConfirming}
          run={async (ids) => {
            const result = await mutateAsync(ids);
            return {
              failed: result.failed.map(({ exportSentId, message }) => ({
                id: exportSentId,
                message,
              })),
              summary: costBatchSummary(result),
            };
          }}
          onFinished={setSelectedIds}
        />
      )}

      {items.length === 0 ? (
        <Center py={10}>
          <VStack spacing={1}>
            <Heading size="sm" color={headingColor}>
              No existen costos de exportación pendientes
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
          selectedIds={selectedIds}
          onSelectedChange={setSelectedIds}
          renderAction={(item) => (
            <OpenWithConfirmation
              href={`${pathname}/${item.id}`}
              label='Revisar costos'
              title={`Abrir Validación de Costos: ${item.export?.merchant?.businessName || '—'}`}
              description='¿Estás seguro de que deseas empezar esta Validación de Costos?'
            />
          )}
        />
      )}
    </VStack>
  );
};

export default ExportCostList;
