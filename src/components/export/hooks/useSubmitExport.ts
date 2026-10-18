'use client';

import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateExport } from '@/hooks/export/createExport';
import { useUpdateExport } from '@/hooks/export/updateExport';
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
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createExport, isLoading: isCreating } = useCreateExport();
  const { mutate: updateExport, isLoading: isUpdating } = useUpdateExport();

  const onSubmit = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    const handlers = {
      onError: (error: AxiosError<ServerErrorResponse>): void => {
        const data = error.response?.data;
        toast({
          title: exportId
            ? 'No se pudo guardar la exportación'
            : 'No se pudo crear la exportación',
          description: serverErrorMessage(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        if (data?.statusCode === 401) {
          router.push('/api/auth/signout');
        }
        if (data?.model && data?.prop) {
          formikHelpers.setFieldError(`${data.prop}`, data.message);
        }
      },
      onSuccess: (): void => {
        toast({
          title: exportId
            ? 'Exportación actualizada'
            : 'Exportación Creada con éxito',
          description: exportId
            ? 'Los cambios se guardaron correctamente.'
            : 'La exportación se ha registrado correctamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('exports');
        queryClient.invalidateQueries('exportsPending');
        queryClient.invalidateQueries('cuttingSheets');
        queryClient.invalidateQueries('cuttingSheetsPending');
        queryClient.invalidateQueries('bookings');
        if (exportId) {
          queryClient.invalidateQueries(['export', String(exportId)]);
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
