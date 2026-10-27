import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
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
    const { mutate: createClient, isLoading } = useCreateClient();

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
                    const { statusCode, message, model, prop }: Partial<ServerErrorResponse> =
                        error.response?.data ?? {};
                    if (statusCode === 401) {
                        router.push('/api/auth/signout');
                    }
                    if (model === 'Client' && prop === 'businessId') {
                        formikHelpers.setFieldTouched(prop, true, false);
                        formikHelpers.setFieldError(prop, message);
                    }
                },
                onSuccess: () => {
                    toaster.create({
                        title: 'Cliente Creado con Éxito',
                        type: 'success',
                        duration: 5000,
                        closable: true,
                    });
                    queryClient.invalidateQueries('clients');
                    queryClient.invalidateQueries('clientsByHarbor');
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
