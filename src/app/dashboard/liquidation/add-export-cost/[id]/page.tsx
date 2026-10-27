'use client';
import { redirect, useParams, usePathname } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import ExportSentCostForm from '../../../../../components/export-cost/ExportSentCostForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExportSent } from '../../../../../hooks/export/export-sent/getExportSent';
import { ExportSentType } from '../../../../../types/exportSent';

function ExportSentCostPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useExportSent({
    exportSentId: params.id,
  });
  const pendingProducerCost = data as Partial<ExportSentType>;
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!pendingProducerCost) {
        return redirect(pathname.replace(/\/\d+$/, ''));
      }
    }
  }, [isLoading, pendingProducerCost, pathname]);

  if (isLoading) {
    return <LoadingState minH='60vh' />;
  }

  return (
    <CardPage
      icon={FiDollarSign}
      title='Validación de costos'
      description='Revisa y confirma los costos asociados al envío seleccionado'
    >
      <ExportSentCostForm pathname={pathname} />
    </CardPage>
  );
}

export default IsOnboarding(ExportSentCostPage);
