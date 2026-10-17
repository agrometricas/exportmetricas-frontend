import { useToast } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import {
  useDeleteShippingContract,
  useSaveShippingContract,
} from '../../../hooks/shipping-contract/mutateShippingContract';
import { ShippingContractResponse } from '../../../types/shippingContract';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import {
  initialValues,
  validationSchema,
  ValuesProps,
  valuesFromContract,
} from '../schemas/shippingContract.schema';
import { shippingContractBody } from '../shippingContractBody';

const LIST_PATH = '/dashboard/client/shipping-contracts';

export function useSubmitShippingContract(
  contract?: ShippingContractResponse
): {
  onSubmit: (values: ValuesProps) => void;
  onDelete: () => void;
  initialValues: ValuesProps;
  validationSchema: typeof validationSchema;
  isLoading: boolean;
  isDeleting: boolean;
} {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isLoading } = useSaveShippingContract();
  const { mutate: remove, isLoading: isDeleting } = useDeleteShippingContract();

  const showError = (error: unknown): void => {
    if (isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
      return;
    }
    toast({
      title: 'No se pudo guardar el contrato naviero',
      description: serverErrorMessage(error),
      status: 'error',
      duration: 6000,
      isClosable: true,
    });
  };

  const done = (title: string): void => {
    toast({ title, status: 'success', duration: 5000, isClosable: true });
    queryClient.invalidateQueries('shippingContracts');
    queryClient.invalidateQueries('shippingContract');
    router.push(LIST_PATH);
  };

  const onSubmit = (values: ValuesProps): void => {
    save(
      {
        id: contract?.id,
        body: shippingContractBody(values, { withShippingCompany: !contract }),
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
