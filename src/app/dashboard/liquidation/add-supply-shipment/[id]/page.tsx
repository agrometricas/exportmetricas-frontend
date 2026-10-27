'use client';
import { AxiosError } from 'axios';
import { redirect, useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect } from 'react';
import { FiPackage } from 'react-icons/fi';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import SentMaterialsExportForm from '../../../../../components/export/SentMaterialsExportForm';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';
import { useExport } from '../../../../../hooks/export/getExport';
import { ExportResponse } from '../../../../../types/export.response';

const PendingExportPage = (): React.JSX.Element => {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useExport({
    exportId: params.id,
  });
  const pendingExport = data as Partial<ExportResponse>;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (error && (error as AxiosError).isAxiosError) {
      const { response } = error as AxiosError<{
        statusCode: number;
      }>;

      const statusCode = response?.data?.statusCode;

      if (statusCode === 401) {
        router.push('/api/auth/signout');
      }
    }
  }, [error, router]);

  useLayoutEffect(() => {
    if (!isLoading) {
      if (!pendingExport || !pendingExport.pendingExportSent) {
        return redirect(pathname.replace(/\/\d+$/, ''));
      }
    }
  }, [isLoading, pendingExport, pathname]);

  if (isLoading) {
    return <LoadingState minH='60vh' />;
  }

  return (
    <CardPage
      icon={FiPackage}
      title='Envío de Insumos'
      description='Completa y confirma el envío de insumos de la exportación'
    >
      <SentMaterialsExportForm
        exportSelected={pendingExport}
        pathname={pathname}
      />
    </CardPage>
  );
};

export default IsOnboarding(PendingExportPage);
