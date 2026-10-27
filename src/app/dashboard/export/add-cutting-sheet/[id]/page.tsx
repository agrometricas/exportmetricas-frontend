'use client';
import { redirect, useParams, usePathname } from 'next/navigation';
import React, { useLayoutEffect } from 'react';
import { MdContentCut } from 'react-icons/md';
import { CardPage } from '@/components/ui/page/PageLayout';
import LoadingState from '@/components/ui/states/LoadingState';
import CuttingSheetForm from '../../../../../components/export/cutting-sheet/CuttingSheetForm';
import { useExportSent } from '../../../../../hooks/export/export-sent/getExportSent';
import { useExport } from '../../../../../hooks/export/getExport';
import { ExportResponse } from '../../../../../types/export.response';
import { ExportSentType } from '../../../../../types/exportSent';

const CuttingSheetPage = (): React.JSX.Element => {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useExport({ exportId: params.id });
  const { data: exportSentData, isLoading: isLoadingSent } = useExportSent({
    exportSentId: data?.exportSent?.id?.toString() ?? '',
  });

  const pendingCuttingSheet = data as Partial<ExportResponse>;
  const exportSent = exportSentData as Partial<ExportSentType>;
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!isLoading && !isLoadingSent) {
      if (!pendingCuttingSheet) {
        return redirect(pathname.replace(/\/\d+$/, ''));
      }
    }
  }, [isLoading, isLoadingSent, pendingCuttingSheet, pathname]);

  if (isLoading || isLoadingSent) {
    return <LoadingState minH='60vh' />;
  }

  return (
    <CardPage
      icon={MdContentCut}
      title='Hoja de corte'
      description='Completa y envía la hoja de corte del envío seleccionado'
    >
      <CuttingSheetForm
        cuttingSheetSelected={pendingCuttingSheet}
        exportSentSelected={exportSent}
      />
    </CardPage>
  );
};

export default CuttingSheetPage;
