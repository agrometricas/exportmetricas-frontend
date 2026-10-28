import { useQueryClient } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import { qk } from '@/lib/queryKeys';
import { useCreateVerifier } from '../../../hooks/verifier/createVerifier';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import {
  ValuesProps,
  validationSchema,
  initialValues,
} from '../schemas/verifier.schema';

export function useSubmitVerifier(): {
  onSubmit: (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ) => Promise<void>;
  validationSchema: typeof validationSchema;
  initialValues: typeof initialValues;
  isLoading: boolean;
} {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createVerifier, isPending: isLoading } = useCreateVerifier();

  const onSubmit = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    const { ...verifierData } = values;
    createVerifier(
      { ...verifierData },
      {
        onError: (error) => {
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
            title: 'Verificadora creada con éxito',
            type: 'success',
            duration: 5000,
            closable: true,
          });
          queryClient.invalidateQueries({
            queryKey: qk('verifiers'),
          });
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
