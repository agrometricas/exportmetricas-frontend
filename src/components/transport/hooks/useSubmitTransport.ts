import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import { useCreateTransport } from '../../../hooks/transport/createTransport';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { ValuesProps, validationSchema, initialValues } from '../schemas/transport.schema';

export function useSubmitTransport(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createTransport, isPending: isLoading } = useCreateTransport();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { ...depositData } = values;
        createTransport(
            { ...depositData },
            {
                onError: (error: AxiosError<ServerErrorResponse>) => {
                    toaster.create({
                        title: 'No se pudo guardar',
                        description: serverErrorMessage(error),
                        type: 'error',
                        duration: 5000,
                        closable: true,
                    });
                },
                onSuccess: () => {
                    toaster.create({
                        title: 'Transporte creado con éxito',
                        type: 'success',
                        duration: 5000,
                        closable: true,
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['transports']
                    });
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
