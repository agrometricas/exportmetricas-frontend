import { useQueryClient } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
import {
  useDeleteProducerContract,
  useSaveProducerContract,
} from '../../../hooks/producer-contract/mutateProducerContract';
import { ProducerContractResponse } from '../../../types/producerContract';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { producerContractBody } from '../producerContractBody';
import {
  initialValues,
  validationSchema,
  ValuesProps,
  valuesFromContract,
} from '../schemas/producerContract.schema';

const LIST_PATH = '/dashboard/producer/contracts';

export function useSubmitProducerContract(
  contract?: ProducerContractResponse
): {
  onSubmit: (values: ValuesProps, helpers: FormikHelpers<ValuesProps>) => void;
  onDelete: () => void;
  initialValues: ValuesProps;
  validationSchema: typeof validationSchema;
  isLoading: boolean;
  isDeleting: boolean;
} {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isPending: isLoading } = useSaveProducerContract();
  const { mutate: remove, isPending: isDeleting } = useDeleteProducerContract();

  const showError = (error: unknown): void => {
    toaster.create({
      title: 'No se pudo guardar el contrato',
      description: serverErrorMessage(error),
      type: 'error',
      duration: 6000,
      closable: true,
    });
  };

  const done = (title: string): void => {
    toaster.create({ title, type: 'success', duration: 5000, closable: true });
    queryClient.invalidateQueries({
      queryKey: ['producerContracts'],
    });
    queryClient.invalidateQueries({
      queryKey: ['producerContract'],
    });
    router.push(LIST_PATH);
  };

  const onSubmit = (values: ValuesProps): void => {
    save(
      {
        id: contract?.id,
        body: producerContractBody(values, { withBusiness: !contract }),
      },
      {
        onError: showError,
        onSuccess: () =>
          done(contract ? 'Contrato actualizado' : 'Contrato creado'),
      }
    );
  };

  const onDelete = (): void => {
    if (!contract) return;
    remove(contract.id, {
      onError: showError,
      onSuccess: () => done('Contrato eliminado'),
    });
  };

  return {
    onSubmit,
    onDelete,
    initialValues: contract ? valuesFromContract(contract) : initialValues,
    validationSchema,
    isLoading,
    isDeleting,
  };
}
