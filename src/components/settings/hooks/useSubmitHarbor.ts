import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import { useCreateHarbor } from '@/hooks/export/harbor/createHarbor';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { ValuesProps, validationSchema, initialValues } from '../schemas/harbor.schema';

export function useSubmitHarbor(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createHarbor, isPending: isLoading } = useCreateHarbor();

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
                onSuccess: () => {
                    toaster.create({
                        title: 'Puerto creado con éxito',
                        type: 'success',
                        duration: 5000,
                        closable: true,
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['harbors']
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['harborsByType']
                    });
                    queryClient.invalidateQueries({
                        queryKey: ['clients']
                    });
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
