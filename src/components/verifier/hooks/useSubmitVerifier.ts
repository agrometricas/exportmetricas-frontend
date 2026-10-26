import { useToast } from '@chakra-ui/react';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateVerifier } from '../../../hooks/verifier/createVerifier';
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
