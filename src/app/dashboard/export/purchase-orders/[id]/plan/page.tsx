'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { MdOutlineViewWeek } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import ExportPlanForm from '../../../../../../components/purchase-order/ExportPlanForm';
import IsOnboarding from '../../../../../../components/ui/IsOnboarding';
import { usePurchaseOrder } from '../../../../../../hooks/purchase-order/getPurchaseOrder';
import { PurchaseOrderResponse } from '../../../../../../types/purchaseOrder';
import { getWeekInfo } from '../../../../../../utils/getWeekInfo';

function ExportPlanPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePurchaseOrder(id);
  const order = data as PurchaseOrderResponse | undefined;

  return (
    <CardPage
      icon={MdOutlineViewWeek}
      title='Plan Semanal'
      description={
        order
          ? `${order.merchant.businessName} · ${getWeekInfo({ date: new Date(order.weekStart) }).week}`
          : 'Cargando la orden'
      }
    >
      {isLoading || !order ? (
        <LoadingState />
      ) : (
        <ExportPlanForm order={order} />
      )}
    </CardPage>
  );
}

export default IsOnboarding(ExportPlanPage);
