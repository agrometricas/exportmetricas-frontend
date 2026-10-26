import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
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
    const toast = useToast();
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
                    toast({
                        title: 'No se pudo guardar',
                        description: serverErrorMessage(error),
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
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
                    toast({
                        title: 'Cliente Creado con Éxito',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
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
