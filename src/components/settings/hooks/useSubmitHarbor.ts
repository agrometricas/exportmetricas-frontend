import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateHarbor } from '@/hooks/export/harbor/createHarbor';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { ValuesProps, validationSchema, initialValues } from '../schemas/harbor.schema';

export function useSubmitHarbor(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const toast = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createHarbor, isLoading } = useCreateHarbor();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { is24Hours, ...harborData } = values;
        void is24Hours;
        createHarbor(
            { ...harborData },
            {
                onError: (error: AxiosError<ServerErrorResponse>) => {
                    const data = error.response?.data;
                    if (!data) return;
                    const { statusCode, message, errors: errorTitle, model, prop } = data;

                    toast({
                        title: `Error ${statusCode}: ${errorTitle}`,
                        description: message,
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });

                    if (statusCode === 401) {
                        router.push('/api/auth/signout');
                        return;
                    }

                    if (model && prop) {
                        const path = `${prop}`;
                        formikHelpers.setFieldTouched(path, true, false);
                        formikHelpers.setFieldError(path, message);
                    }
                },
                onSuccess: () => {
                    toast({
                        title: 'Puerto Creado con Éxito',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    queryClient.invalidateQueries('harbors');
                    queryClient.invalidateQueries('harborsByType');
                    queryClient.invalidateQueries('clients');
                    formikHelpers.resetForm();
                    router.push('/dashboard/client/harbors');
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
