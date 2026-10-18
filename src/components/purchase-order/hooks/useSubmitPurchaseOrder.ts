import { useToast } from '@chakra-ui/react';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import {
  useDeletePurchaseOrder,
  useSavePurchaseOrder,
} from '../../../hooks/purchase-order/mutatePurchaseOrder';
import { PurchaseOrderResponse } from '../../../types/purchaseOrder';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { purchaseOrderBody } from '../purchaseOrderBody';
import {
  initialValues,
  validationSchema,
  ValuesProps,
  valuesFromOrder,
} from '../schemas/purchaseOrder.schema';

const LIST_PATH = '/dashboard/export/purchase-orders';

export function useSubmitPurchaseOrder(order?: PurchaseOrderResponse): {
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
  const { mutate: save, isLoading } = useSavePurchaseOrder();
  const { mutate: remove, isLoading: isDeleting } = useDeletePurchaseOrder();

  const showError = (error: unknown): void => {
    if (isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
      return;
    }
    toast({
      title: 'No se pudo guardar la orden de compra',
      description: serverErrorMessage(error),
      status: 'error',
      duration: 6000,
      isClosable: true,
    });
  };

  const refresh = (): void => {
    queryClient.invalidateQueries('purchaseOrders');
    queryClient.invalidateQueries('purchaseOrder');
  };

  const onSubmit = (values: ValuesProps): void => {
    save(
      { id: order?.id, body: purchaseOrderBody(values, { editing: !!order }) },
      {
        onError: showError,
        onSuccess: ({ data }) => {
          toast({
            title: order
              ? 'Orden de compra actualizada'
              : 'Orden de compra creada',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          refresh();
          // A new order opens on its own page, where each line becomes an
          // export.
          if (!order) router.push(`${LIST_PATH}/${data.id}`);
        },
      }
    );
  };

  const onDelete = (): void => {
    if (!order) return;
    remove(order.id, {
      onError: showError,
      onSuccess: () => {
        toast({
          title: 'Orden de compra eliminada',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        refresh();
        router.push(LIST_PATH);
      },
    });
  };

  return {
    onSubmit,
    onDelete,
    initialValues: order ? valuesFromOrder(order) : initialValues,
    validationSchema,
    isLoading,
    isDeleting,
  };
}
