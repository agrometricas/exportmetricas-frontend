'use client';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { MdOutlineViewWeek } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import ExportPlanForm from '../../../../../components/purchase-order/ExportPlanForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { getWeekInfo } from '../../../../../utils/getWeekInfo';

const idParam = (value: string | null): number | '' =>
  value && Number(value) > 0 ? Number(value) : '';

function AssignFarms(): React.JSX.Element {
  const params = useSearchParams();
  const week = params.get('week');
  return (
    <CardPage
      icon={MdOutlineViewWeek}
      title='Asignar fincas'
      description={
        week
          ? `Lo que pidió el cliente para la ${getWeekInfo({ date: new Date(week) }).week.split(' //')[0]}, repartido entre fincas`
          : 'Lo que pidió el cliente, repartido entre fincas'
      }
    >
      <ExportPlanForm
        clientId={idParam(params.get('client'))}
        boxBrandId={idParam(params.get('boxBrand'))}
        pendingBoxes={Number(params.get('pending')) || undefined}
        week={week}
      />
    </CardPage>
  );
}

function AssignFarmsPage(): React.JSX.Element {
  return (
    <Suspense fallback={<LoadingState />}>
      <AssignFarms />
    </Suspense>
  );
}

export default IsOnboarding(AssignFarmsPage);
