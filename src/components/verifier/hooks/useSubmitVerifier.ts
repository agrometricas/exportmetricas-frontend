import { useToast } from '@chakra-ui/react';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateVerifier } from '../../../hooks/verifier/createVerifier';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { ValuesProps, validationSchema, initialValues } from '../schemas/verifier.schema';

export function useSubmitVerifier(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const toast = useToast();
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
                        title: 'Verificadora Creada con éxito',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
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
