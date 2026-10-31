'use client';
import React from 'react';
import { MdOutlineAssignment } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import PurchaseOrderForm from '../../../../components/purchase-order/PurchaseOrderForm';
import IsOnboarding from '../../../../components/ui/IsOnboarding';

function AddPurchaseOrderPage(): React.JSX.Element {
  return (
    <CardPage
      icon={MdOutlineAssignment}
      title='Agregar orden de compra'
      description='Lo que pide un cliente: por alícuota, cajas por semana y precio'
      width='wide'
    >
      <PurchaseOrderForm />
    </CardPage>
  );
}

export default IsOnboarding(AddPurchaseOrderPage);
