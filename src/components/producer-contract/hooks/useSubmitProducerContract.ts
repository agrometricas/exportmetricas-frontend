import { useToast } from '@chakra-ui/react';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
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

export function useSubmitProducerContract(contract?: ProducerContractResponse): {
  onSubmit: (values: ValuesProps, helpers: FormikHelpers<ValuesProps>) => void;
  onDelete: () => void;
  initialValues: ValuesProps;
  validationSchema: typeof validationSchema;
  isLoading: boolean;
  isDeleting: boolean;
} {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isLoading } = useSaveProducerContract();
  const { mutate: remove, isLoading: isDeleting } = useDeleteProducerContract();

  const showError = (error: unknown): void => {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      (error as { response?: { status?: number } }).response?.status === 401
    ) {
      router.push('/api/auth/signout');
      return;
    }
    toast({
      title: 'No se pudo guardar el contrato',
      description: serverErrorMessage(error),
      status: 'error',
      duration: 6000,
      isClosable: true,
    });
  };

  const done = (title: string): void => {
    toast({ title, status: 'success', duration: 5000, isClosable: true });
    queryClient.invalidateQueries('producerContracts');
    queryClient.invalidateQueries('producerContract');
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
        onSuccess: () => done(contract ? 'Contrato actualizado' : 'Contrato creado'),
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
