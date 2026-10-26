import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateTransport } from '../../../hooks/transport/createTransport';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { ValuesProps, validationSchema, initialValues } from '../schemas/transport.schema';

export function useSubmitTransport(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const toast = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createTransport, isLoading } = useCreateTransport();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { ...depositData } = values;
        createTransport(
            { ...depositData },
            {
                onError: (error: AxiosError<ServerErrorResponse>) => {
                    const data = error.response?.data;
                    if (!data) return;
                    const { statusCode, message, errors: errorTitle } = data;
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
                },
                onSuccess: () => {
                    toast({
                        title: 'Transporte Creado con éxito',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    queryClient.invalidateQueries('transports');
                    formikHelpers.resetForm();
                    router.push('/dashboard/client/transports');
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
