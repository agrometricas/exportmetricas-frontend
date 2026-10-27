'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import { useCreateExport } from '@/hooks/export/createExport';
import { useUpdateExport } from '@/hooks/export/updateExport';
import { ServerErrorResponse } from '@/types/errorResponse';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { exportBody } from '../exportBody';
import { ValuesProps, validationSchema } from '../schemas/export.schema';

export function useSubmitExport({
  exportId,
  purchaseOrderId,
}: { exportId?: number; purchaseOrderId?: number } = {}): {
  onSubmit: (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ) => Promise<void>;
  validationSchema: typeof validationSchema;
  isLoading: boolean;
} {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createExport, isPending: isCreating } = useCreateExport();
  const { mutate: updateExport, isPending: isUpdating } = useUpdateExport();

  const onSubmit = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    const handlers = {
      onError: (error: AxiosError<ServerErrorResponse>): void => {
        const data = error.response?.data;
        toaster.create({
          title: exportId
            ? 'No se pudo guardar la exportación'
            : 'No se pudo crear la exportación',
          description: serverErrorMessage(error),
          type: 'error',
          duration: 5000,
          closable: true,
        });
        if (data?.statusCode === 401) {
          router.push('/api/auth/signout');
        }
        if (data?.model && data?.prop) {
          formikHelpers.setFieldError(`${data.prop}`, data.message);
        }
      },
      onSuccess: (): void => {
        toaster.create({
          title: exportId
            ? 'Exportación actualizada'
            : 'Exportación creada con éxito',
          description: exportId
            ? 'Los cambios se guardaron correctamente.'
            : 'La exportación se ha registrado correctamente.',
          type: 'success',
          duration: 5000,
          closable: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['exports'],
        });
        queryClient.invalidateQueries({
          queryKey: ['exportsPending'],
        });
        queryClient.invalidateQueries({
          queryKey: ['cuttingSheets'],
        });
        queryClient.invalidateQueries({
          queryKey: ['cuttingSheetsPending'],
        });
        queryClient.invalidateQueries({
          queryKey: ['bookings'],
        });
        queryClient.invalidateQueries({
          queryKey: ['vessels'],
        });
        queryClient.invalidateQueries({
          queryKey: ['purchaseOrders'],
        });
        queryClient.invalidateQueries({
          queryKey: ['purchaseOrder'],
        });
        queryClient.invalidateQueries({
          queryKey: ['contractUsage'],
        });
        queryClient.invalidateQueries({
          queryKey: ['contractUsageCheck'],
        });
        queryClient.invalidateQueries({
          queryKey: ['exportProgress'],
        });
        queryClient.invalidateQueries({
          queryKey: ['workQueue'],
        });
        queryClient.invalidateQueries({
          queryKey: ['lastFarmExport'],
        });
        if (exportId) {
          queryClient.invalidateQueries({
            queryKey: ['export', String(exportId)],
          });
        }
        formikHelpers.resetForm();
        router.push(
          purchaseOrderId
            ? `/dashboard/export/purchase-orders/${purchaseOrderId}`
            : '/dashboard/export/search'
        );
      },
    };

    const data = exportBody(values);
    if (exportId) {
      updateExport({ exportId, data }, handlers);
    } else {
      createExport(data, handlers);
    }
  };

  return {
    onSubmit,
    validationSchema,
    isLoading: isCreating || isUpdating,
  };
}
