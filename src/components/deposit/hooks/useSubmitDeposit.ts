import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateDeposit } from '../../../hooks/deposit/createDeposit';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { ValuesProps, validationSchema, initialValues } from '../schemas/deposit.schema';

export function useSubmitDeposit(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const toast = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createDeposit, isLoading } = useCreateDeposit();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { is24Hours, countryId, provinceId, ...depositData } = values;
        void is24Hours, countryId, provinceId;
        createDeposit(
            { ...depositData },
            {
                onError: (error: AxiosError<ServerErrorResponse>) => {
                    const statusCode = error.response?.status;
                    toast({
                        title: 'No se pudo guardar',
                        description: serverErrorMessage(error),
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
                        title: 'Depósito Creado con éxito',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    queryClient.invalidateQueries('deposits');
                    formikHelpers.resetForm();
                    router.push('/dashboard/client/deposits');
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
