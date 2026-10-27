'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdLocalShipping } from 'react-icons/md';
import ExportFromLine from '@/components/purchase-order/ExportFromLine';
import IsOnboarding from '@/components/ui/IsOnboarding';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import { usePurchaseOrder } from '@/hooks/purchase-order/getPurchaseOrder';
import { PurchaseOrderResponse } from '@/types/purchaseOrder';
import { getWeekInfo } from '@/utils/getWeekInfo';

function ExportFromLinePage(): React.JSX.Element {
  const { id, lineId } = useParams<{ id: string; lineId: string }>();
  const { data, isLoading } = usePurchaseOrder(id);
  const order = data as PurchaseOrderResponse | undefined;

  return (
    <CardPage
      icon={MdLocalShipping}
      title='Crear exportación'
      description={
        order
          ? `De la orden de compra de ${order.merchant.businessName} · ${getWeekInfo({ date: new Date(order.weekStart) }).week}`
          : 'Cargando la orden'
      }
    >
      {isLoading || !order ? (
        <LoadingState />
      ) : (
        <ExportFromLine order={order} lineId={Number(lineId)} />
      )}
    </CardPage>
  );
}

export default IsOnboarding(ExportFromLinePage);
