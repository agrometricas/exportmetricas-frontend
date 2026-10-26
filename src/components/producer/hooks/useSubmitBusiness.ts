import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateBusiness } from '../../../hooks/business/createBusiness';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { ValuesProps, validationSchema, initialValues } from '../schemas/business.schema';

export function useSubmitBusiness(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const toast = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createBusiness, isLoading } = useCreateBusiness();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { ...businessData } = values;
        createBusiness(
            { ...businessData, area: Number(businessData.area) },
            {
                onError: (error: AxiosError<ServerErrorResponse>) => {
                    const { statusCode, message, model, prop }: Partial<ServerErrorResponse> =
                        error.response?.data ?? {};

                    toast({
                        title: 'No se pudo guardar',
                        description: serverErrorMessage(error),
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
                onSuccess: async () => {
                    toast({
                        title: 'Finca Creada con Éxito',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    queryClient.invalidateQueries('businesses');
                    formikHelpers.resetForm();
                    router.push('/dashboard/producer/fincas');
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
