import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateClient } from '@/hooks/export/client/createClient';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { clientTermsBody } from '../../../utils/clientTerms';
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
        const {
            dataReviewed,
            purchaseVolumeBoxes,
            purchaseVolumePeriod,
            paymentTermValue,
            paymentTermUnit,
            ...clientData
        } = values;
        dataReviewed;
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
                    const { response } = error;
                    if (response) {
                        const { statusCode, message, errors: errorTitle, model, prop } = response.data;
                        toast({
                            title: `Error ${statusCode}: ${errorTitle}`,
                            description: message,
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                        });
                        if (statusCode === 401) {
                            router.push('/api/auth/signout');
                        }
                        if (model === 'Client' && prop === 'businessId') {
                            formikHelpers.setFieldTouched(prop, true, false);
                            formikHelpers.setFieldError(prop, message);
                        }
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
