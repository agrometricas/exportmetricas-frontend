 
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import { useClientPaymentsPending } from './client-payment/getClientPaymentPending';
import { useCuttingSheetsPending } from './export/cuttingSheet/getExportsSentPending';
import { useExportSentCostsPending } from './export/export-sent/getExportSentCostsPending';
import { useExportsSentPending } from './export/export-sent/getExportsSentPending';
import { useExportsPending } from './export/getExportsPending';

interface MenuCounts {
  addSupplyShipment: number;
  producerPendingPayments: number;
  addCuttingSheet: number;
  clientPendingPayments: number;
  exportSentCostsPending: number;
}

export function useMenuCounts(): {
  counts: MenuCounts;
  loading: boolean;
  error: unknown;
} {
  const {
    data: supplyData,
    isLoading: isSupplyLoading,
    error: supplyError,
  } = useExportsPending();

  const {
    data: producerData,
    isLoading: isProducerLoading,
    error: producerError,
  } = useExportsSentPending();

  const {
    data: clientData,
    isLoading: isClientLoading,
    error: clientError,
  } = useClientPaymentsPending();

  const {
    data: cuttingData,
    isLoading: isCuttingLoading,
    error: cuttingError,
  } = useCuttingSheetsPending();

  const {
    data: exportSentCostsPendingData,
    isLoading: isExportSentCostsPendingLoading,
    error: exportSentCostsPendingError,
  } = useExportSentCostsPending();

  const [counts, setCounts] = useState<MenuCounts>({
    addSupplyShipment: 0,
    producerPendingPayments: 0,
    addCuttingSheet: 0,
    clientPendingPayments: 0,
    exportSentCostsPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !isSupplyLoading &&
      !isProducerLoading &&
      !isCuttingLoading &&
      !isClientLoading &&
      !isExportSentCostsPendingLoading
    ) {
      setCounts({
        addSupplyShipment: supplyData?.length || 0,
        producerPendingPayments: producerData?.length || 0,
        addCuttingSheet: cuttingData?.length || 0,
        clientPendingPayments: clientData?.length || 0,
        exportSentCostsPending: exportSentCostsPendingData?.length || 0,
      });
      setLoading(false);
    }
    if (
      supplyError ||
      producerError ||
      cuttingError ||
      clientError ||
      exportSentCostsPendingError
    ) {
      setLoading(false);
    }
  }, [
    isSupplyLoading,
    isProducerLoading,
    isCuttingLoading,
    isClientLoading,
    isExportSentCostsPendingLoading,
    supplyData,
    producerData,
    cuttingData,
    clientData,
    exportSentCostsPendingData,
    supplyError,
    producerError,
    cuttingError,
    clientError,
    exportSentCostsPendingError,
  ]);

  return { counts, loading, error };
}
