import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { toaster } from '@/components/ui/toaster';
import { useCreateVerifier } from '../../../hooks/verifier/createVerifier';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { ValuesProps, validationSchema, initialValues } from '../schemas/verifier.schema';

export function useSubmitVerifier(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: createVerifier, isLoading } = useCreateVerifier();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { ...verifierData } = values;
        createVerifier(
            { ...verifierData },
            {
                onError: (error) => {
                    const statusCode = error.response?.status;
                    toaster.create({
                        title: 'No se pudo guardar',
                        description: serverErrorMessage(error),
                        type: 'error',
                        duration: 5000,
                        closable: true,
                    });
                    if (statusCode === 401) {
                        router.push('/api/auth/signout');
                    }
                },
                onSuccess: () => {
                    toaster.create({
                        title: 'Verificadora creada con éxito',
                        type: 'success',
                        duration: 5000,
                        closable: true,
                    });
                    queryClient.invalidateQueries('verifiers');
                    formikHelpers.resetForm();
                    router.push('/dashboard/box-brands/verifiers');
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
