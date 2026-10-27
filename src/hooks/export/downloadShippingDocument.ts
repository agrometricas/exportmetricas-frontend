import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '../../lib/axios';
import { ServerErrorResponse } from '../../types/errorResponse';
import { withJsonErrorBody } from '../../utils/blobError';

export type ShippingDocumentKind = 'invoice' | 'packing-list';

type Input = { exportId: number; kind: ShippingDocumentKind };

async function downloadShippingDocument({
  exportId,
  kind,
}: Input): Promise<Blob> {
  try {
    const response = await axios.get<Blob>(`/export/${exportId}/${kind}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw await withJsonErrorBody(error);
  }
}

export function useDownloadShippingDocument(): UseMutationResult<
  Blob,
  AxiosError<ServerErrorResponse>,
  Input
> {
  return useMutation({ mutationFn: downloadShippingDocument });
}
