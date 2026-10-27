import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import { useCreateClient } from '@/hooks/export/client/createClient';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { clientTermsBody } from '../../../utils/clientTerms';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { initialValues, validationSchema, ValuesProps } from '../schemas/client.schema';

export function useSubmitClient(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createClient, isPending: isLoading } = useCreateClient();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { purchaseVolumeBoxes,
            purchaseVolumePeriod,
            paymentTermValue,
            paymentTermUnit,
            ...clientData
        } = values;
        createClient(
            {
                ...clientData,
                ...clientTermsBody({
                    purchaseVolumeBoxes,
                    purchaseVolumePeriod,
                    paymentTermValue,
                    paymentTermUnit,
                }),
            },
            {
                onError: (error: AxiosError<ServerErrorResponse>) => {
                    toaster.create({
                        title: 'No se pudo guardar',
                        description: serverErrorMessage(error),
                        type: 'error',
                        duration: 5000,
                        closable: true,
                    });
                    const { message, model, prop }: Partial<ServerErrorResponse> =
                        error.response?.data ?? {};
                    if (model === 'Client' && prop === 'businessId') {
                        formikHelpers.setFieldTouched(prop, true, false);
                        formikHelpers.setFieldError(prop, message);
                    }
                },
                onSuccess: () => {
                    toaster.create({
                        title: 'Cliente creado con éxito',
                        type: 'success',
                        duration: 5000,
                        closable: true,
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['clients']
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['clientsByHarbor']
                    });
                    formikHelpers.resetForm();
                    router.push('/dashboard/client/clients');
                },
            }
        );
    };

    return {
        onSubmit,
        validationSchema,
        initialValues,
        isLoading,
    };
}
