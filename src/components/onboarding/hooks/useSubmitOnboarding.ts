import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import { toaster } from '@/components/ui/toaster';
import { useCreateOnboarding } from '../../../hooks/merchants/createOnboarding';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import {
    ValuesProps,
    validationSchema,
    initialValues,
} from '../schema/onboarding.schema';

export function useSubmitOnboarding(): {
    onSubmit: (values: ValuesProps, formikHelpers: FormikHelpers<ValuesProps>) => Promise<void>;
    validationSchema: typeof validationSchema;
    initialValues: typeof initialValues;
    isLoading: boolean;
} {
    const router = useRouter();
    const { update } = useSession();
    const { mutate: createOnboarding, isLoading } = useCreateOnboarding();
    const queryClient = useQueryClient();

    const onSubmit = async (
        values: ValuesProps,
        formikHelpers: FormikHelpers<ValuesProps>
    ): Promise<void> => {
        const { businesses, ...producerData } = values;
        const { area, ...businessData } = businesses[0];
        createOnboarding(
            {
                ...producerData,
                businesses: [{ area: Number(area), ...businessData }],
            },
            {
                onError: (error: AxiosError<ServerErrorResponse>) => {
                    const { statusCode, message, model, prop }: Partial<ServerErrorResponse> =
                        error.response?.data ?? {};

                    toaster.create({
                        title: 'No se pudo guardar',
                        description: serverErrorMessage(error),
                        type: 'error',
                        duration: 5000,
                        closable: true,
                    });

                    if (statusCode === 401) {
                        router.push('/api/auth/signout');
                        return;
                    }

                    if (model && prop) {
                        const path = model === 'Merchant'
                            ? prop
                            : `businesses[0].${prop}`;

                        formikHelpers.setFieldTouched(path, true, false);
                        formikHelpers.setFieldError(path, message);
                    }
                },
                onSuccess: async () => {
                    toaster.create({
                        title: 'Productor Creado con Éxito',
                        type: 'success',
                        duration: 5000,
                        closable: true,
                    });

                    queryClient.invalidateQueries('merchants');
                    formikHelpers.resetForm();
                    await update({ onboardingStatus: 'done' });
                    router.push('/dashboard/producer/producers');
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
