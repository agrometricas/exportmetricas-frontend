/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Badge,
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { MdLocalShipping } from 'react-icons/md';
import { pendingExportColumns, pendingExportLabel } from './pendingColumns';
import { useCreateExportSentBatch } from '../../hooks/export/export-sent/createExportSentBatch';
import { useExportsPending } from '../../hooks/export/getExportsPending';
import { usePagination } from '../../hooks/usePagination';
import { ExportType } from '../../types/export';
import { shipmentBatchSummary } from '../../utils/shipmentBatch';
import BatchActionBar from '../ui/BatchActionBar';
import PendingTable from '../ui/PendingTable';

const SHIPMENT_QUERIES = [
  'exports',
  'export',
  'exportsPending',
  'exportsSent',
  'exportsSentPending',
  'cuttingSheets',
  'cuttingSheetsPending',
  'exportSentCostsPending',
  'clientPaymentsPending',
  'exporterMaterialStock',
  'businessStock',
  'stockMovements',
  'exportProgress',
  'workQueue',
];

type ApiErrorData = {
  statusCode?: number;
  message?: string;
  error?: string;
};

const ExportList = (): React.JSX.Element => {
  const { paginationParams } = usePagination();
  const { data = [], isLoading, error } = useExportsPending(paginationParams);
  const router = useRouter();
  const pathname = usePathname();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { mutateAsync, isLoading: isSending } = useCreateExportSentBatch();
  const columns = useMemo(
    () => pendingExportColumns<Partial<ExportType>>((row) => row),
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

  const items = data as Partial<ExportType>[];
  const selected = items.filter((item) =>
    selectedIds.includes(Number(item.id))
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
        <BatchActionBar
          selected={selected}
          keyOf={(item) => Number(item.id)}
          labelOf={pendingExportLabel}
          hint='Elige en la tabla las que salen con lo que propone su alícuota. Para cambiar una cantidad, abre esa exportación.'
          icon={<MdLocalShipping />}
          actionLabel='Enviar lo propuesto'
          confirmTitle='Enviar los insumos propuestos'
          confirmText={(count) =>
            `Se registra el envío de ${count === 1 ? '1 exportación' : `${count} exportaciones`} con las cantidades que propone cada alícuota, y se descuenta del stock de cada finca.`
          }
          confirmLabel={(count) =>
            `Registrar ${count === 1 ? '1 envío' : `${count} envíos`}`
          }
          failuresTitle='Quedaron sin enviar'
          errorTitle='No se pudo registrar el lote'
          affectedQueries={SHIPMENT_QUERIES}
          isRunning={isSending}
          run={async (ids) => {
            const result = await mutateAsync(ids);
            return {
              failed: result.failed.map(({ exportId, message }) => ({
                id: exportId,
                message,
              })),
              summary: shipmentBatchSummary(result),
            };
          }}
          onFinished={setSelectedIds}
        />
      )}

      {items.length === 0 ? (
        <Center py={10}>
          <VStack spacing={1}>
            <Heading size="sm" color={headingColor}>
              No existen exportaciones pendientes
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
            <Button
              as={NextLink}
              href={`${pathname}/${item.id}`}
              size='sm'
              colorScheme='green'
            >
              Realizar envío
            </Button>
          )}
        />
      )}
    </VStack>
  );
};

export default ExportList;
