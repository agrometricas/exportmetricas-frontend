import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
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
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createBusiness, isPending: isLoading } = useCreateBusiness();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { ...businessData } = values;
        createBusiness(
            { ...businessData, area: Number(businessData.area) },
            {
                onError: (error: AxiosError<ServerErrorResponse>) => {
                    const { message, model, prop }: Partial<ServerErrorResponse> =
                        error.response?.data ?? {};

                    toaster.create({
                        title: 'No se pudo guardar',
                        description: serverErrorMessage(error),
                        type: 'error',
                        duration: 5000,
                        closable: true,
                    });


                    if (model && prop) {
                        const path = `${prop}`;
                        formikHelpers.setFieldTouched(path, true, false);
                        formikHelpers.setFieldError(path, message);
                    }
                },
                onSuccess: async () => {
                    toaster.create({
                        title: 'Finca creada con éxito',
                        type: 'success',
                        duration: 5000,
                        closable: true,
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['businesses']
                    });
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
