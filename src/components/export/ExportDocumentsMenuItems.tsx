import { Menu } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdPictureAsPdf } from 'react-icons/md';
import { toaster } from '@/components/ui/toaster';
import {
  ShippingDocumentKind,
  useDownloadShippingDocument,
} from '../../hooks/export/downloadShippingDocument';
import { serverErrorMessage } from '../../utils/serverErrorMessage';

const DOCUMENTS: { kind: ShippingDocumentKind; label: string; file: string }[] =
  [
    { kind: 'invoice', label: 'Factura comercial (PDF)', file: 'factura' },
    { kind: 'packing-list', label: 'Packing list (PDF)', file: 'packing-list' },
  ];

function save(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export default function ExportDocumentsMenuItems({
  exportId,
  isCancelled,
}: {
  exportId: number;
  isCancelled: boolean;
}): React.JSX.Element {
  const router = useRouter();
  const { mutate: download } = useDownloadShippingDocument();

  return (
    <>
      {DOCUMENTS.map(({ kind, label, file }) => (
        <Menu.Item
          key={kind}
          value={kind}
          disabled={isCancelled}
          onClick={() =>
            download(
              { exportId, kind },
              {
                onSuccess: (blob) =>
                  save(blob, `${file}-exportacion-${exportId}.pdf`),
                onError: (error) => {
                  if (isAxiosError(error) && error.response?.status === 401) {
                    router.push('/api/auth/signout');
                    return;
                  }
                  toaster.create({
                    title: 'No se pudo generar el documento',
                    description: serverErrorMessage(error),
                    type: 'error',
                    duration: 6000,
                    closable: true,
                  });
                },
              }
            )
          }
        >
          <MdPictureAsPdf />
          {label}
        </Menu.Item>
      ))}
    </>
  );
}
