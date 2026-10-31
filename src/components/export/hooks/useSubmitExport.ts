'use client';

import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import { useCreateExport } from '@/hooks/export/createExport';
import { useUpdateExport } from '@/hooks/export/updateExport';
import { qk } from '@/lib/queryKeys';
import { ServerErrorResponse } from '@/types/errorResponse';
import { serverErrorMessage } from '@/utils/serverErrorMessage';
import { exportBody } from '../exportBody';
import { ValuesProps, validationSchema } from '../schemas/export.schema';

export function useSubmitExport({ exportId }: { exportId?: number } = {}): {
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
          queryKey: qk('exports'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('exportsPending'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('cuttingSheets'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('cuttingSheetsPending'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('bookings'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('vessels'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('purchaseOrderWeek'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('priceSheet'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('contractUsage'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('contractUsageCheck'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('exportProgress'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('workQueue'),
        });
        queryClient.invalidateQueries({
          queryKey: qk('lastFarmExport'),
        });
        if (exportId) {
          queryClient.invalidateQueries({
            queryKey: qk('export', String(exportId)),
          });
        }
        formikHelpers.resetForm();
        router.push('/dashboard/export/search');
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
