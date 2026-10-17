'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import ExportFormPage from '../../../../../components/export/ExportFormPage';
import IsOnboarding from '../../../../../components/ui/IsOnboarding';

function EditExportPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  return <ExportFormPage exportId={id} mode='edit' />;
}

export default IsOnboarding(EditExportPage);
