import { useEffect, useState } from 'react';
import { useClientPaymentsPending } from './client-payment/getClientPaymentPending';
import { useCuttingSheetsPending } from './export/cuttingSheet/getExportsSentPending';
import { useExportSentCostsPending } from './export/export-sent/getExportSentCostsPending';
import { useExportsSentPending } from './export/export-sent/getExportsSentPending';
import { useExportsPending } from './export/getExportsPending';
// The pending lists come untyped from serializeQueryResult; these are the
// fields read here.
type PendingSheet = {
  id: number;
  export: { boxQuantity: number; weekDescription: string };
};
type PendingSupply = {
  id: number;
  boxQuantity: number;
  client: { businessName: string };
};
type PendingPayment = {
  id: number;
  export: { merchant: { businessName: string; contractType: string } };
};
type PendingCollection = {
  id: number;
  export?: { client?: { businessName: string } };
};
type PendingCost = {
  id: number;
  export?: { merchant?: { businessName: string } };
};

export interface NotificationItem {
  message: string;
  detail?: string;
  href: string;
}

export function useNotifications(): {
  notifications: NotificationItem[];
  isLoading: boolean;
} {
  const { data: cuttingSheets, isLoading: isLoadingCuttingSheets } =
    useCuttingSheetsPending();
  const { data: supplies, isLoading: isLoadingSupplies } = useExportsPending();
  const { data: payments, isLoading: isLoadingPayments } =
    useExportsSentPending();
  const { data: clientPayments, isLoading: isLoadingClientPayments } =
    useClientPaymentsPending();
  const {
    data: exportSentCostsPendingData,
    isLoading: isExportSentCostsPendingLoading,
  } = useExportSentCostsPending();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const isLoading =
    isLoadingCuttingSheets ||
    isLoadingSupplies ||
    isLoadingPayments ||
    isLoadingClientPayments ||
    isExportSentCostsPendingLoading;

  useEffect(() => {
    const newNotifications: NotificationItem[] = [];

    if (cuttingSheets?.length > 0) {
      newNotifications.push(
        ...cuttingSheets.map((sheet: PendingSheet) => ({
          message: `Hoja de corte pendiente con ID ${sheet.id}`,
          detail: `Cajas: ${sheet.export.boxQuantity}, ${sheet.export.weekDescription}`,
          href: `/dashboard/export/add-cutting-sheet/${sheet.id}`,
        }))
      );
    }

    if (supplies?.length > 0) {
      newNotifications.push(
        ...supplies.map((supply: PendingSupply) => ({
          message: `Envío de insumos pendiente con ID ${supply.id}`,
          detail: `Cajas: ${supply.boxQuantity}, Cliente: ${supply.client.businessName}`,
          href: `/dashboard/liquidation/add-supply-shipment/${supply.id}`,
        }))
      );
    }

    if (payments?.length > 0) {
      newNotifications.push(
        ...payments.map((payment: PendingPayment) => ({
          message: `Pago pendiente al productor con ID ${payment.id}`,
          detail: `Productor: ${payment.export.merchant.businessName}, ${payment.export.merchant.contractType} `,
          href: `/dashboard/liquidation/producer-pending-payments/${payment.id}`,
        }))
      );
    }

    if (clientPayments?.length > 0) {
      newNotifications.push(
        ...clientPayments.map((clientPayment: PendingCollection) => ({
          message: `Cobro pendiente al cliente con ID ${clientPayment.id}`,
          detail: `Cliente: ${clientPayment.export?.client?.businessName}`,
          href: `/dashboard/liquidation/client-pending-payments/${clientPayment.id}`,
        }))
      );
    }

    if (exportSentCostsPendingData?.length > 0) {
      newNotifications.push(
        ...exportSentCostsPendingData.map((cost: PendingCost) => ({
          message: `Costo de envío pendiente con ID ${cost.id}`,
          detail: `Productor: ${cost.export?.merchant?.businessName}`,
          href: `/dashboard/liquidation/add-export-cost/${cost.id}`,
        }))
      );
    }

    setNotifications(newNotifications);
  }, [
    cuttingSheets,
    supplies,
    payments,
    clientPayments,
    exportSentCostsPendingData,
  ]);

  return { notifications, isLoading };
}
