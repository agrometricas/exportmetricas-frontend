'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdOutlineAssignment } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import PurchaseOrderForm from '../../../../../components/purchase-order/PurchaseOrderForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { usePurchaseOrder } from '../../../../../hooks/purchase-order/getPurchaseOrder';
import { PurchaseOrderResponse } from '../../../../../types/purchaseOrder';
import { getWeekInfo } from '../../../../../utils/getWeekInfo';

function PurchaseOrderPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePurchaseOrder(id);
  const order = data as PurchaseOrderResponse | undefined;

  return (
    <CardPage
      icon={MdOutlineAssignment}
      title='Orden de compra'
      description={
        order
          ? `${order.merchant.businessName} · ${getWeekInfo({ date: new Date(order.weekStart) }).week}`
          : 'Cargando la orden'
      }
      width='wide'
    >
      {isLoading || !order ? (
        <LoadingState />
      ) : (
        <PurchaseOrderForm order={order} />
      )}
    </CardPage>
  );
}

export default IsOnboarding(PurchaseOrderPage);
