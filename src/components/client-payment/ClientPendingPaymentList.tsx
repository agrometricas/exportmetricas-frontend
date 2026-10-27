'use client';
import { Badge, Box, Heading, VStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import EmptyState from '@/components/ui/states/EmptyState';
import ErrorState from '@/components/ui/states/ErrorState';
import LoadingState from '@/components/ui/states/LoadingState';
import { useClientPaymentsPending } from '../../hooks/client-payment/getClientPaymentPending';
import { ExportSentType } from '../../types/exportSent';
import { pendingExportColumns } from '../export/pendingColumns';
import OpenWithConfirmation from '../ui/OpenWithConfirmation';
import PendingTable from '../ui/PendingTable';

const PendingPaymentList = (): React.JSX.Element => {
  const { data = [], isLoading, error, refetch } = useClientPaymentsPending();

  const pathname = usePathname();
  const columns = useMemo(
    () => pendingExportColumns<Partial<ExportSentType>>((row) => row.export),
    []
  );

  const headingColor = 'fg.heading';


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
    <VStack gap={4} align="stretch">
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        justifyContent="space-between"
        w="100%"
      >
        <Heading size="md" color={headingColor}>
          Cobros pendientes
        </Heading>
        <Badge colorPalette="green" variant="subtle" px={3} py={1} borderRadius="full">
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
              description='¿Estás seguro de que deseas empezar este cobro pendiente?'
            />
          )}
        />
      )}
    </VStack>
  );
};

export default PendingPaymentList;
