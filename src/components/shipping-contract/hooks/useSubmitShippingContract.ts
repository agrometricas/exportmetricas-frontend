import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isPending: isLoading } = useSaveShippingContract();
  const { mutate: remove, isPending: isDeleting } = useDeleteShippingContract();

  const showError = (error: unknown): void => {
    toaster.create({
      title: 'No se pudo guardar el contrato naviero',
      description: serverErrorMessage(error),
      type: 'error',
      duration: 6000,
      closable: true,
    });
  };

  const done = (title: string): void => {
    toaster.create({ title, type: 'success', duration: 5000, closable: true });
    queryClient.invalidateQueries({
      queryKey: ['shippingContracts'],
    });
    queryClient.invalidateQueries({
      queryKey: ['shippingContract'],
    });
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
