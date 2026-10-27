import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toaster } from '@/components/ui/toaster';
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isPending: isLoading } = useSavePurchaseOrder();
  const { mutate: remove, isPending: isDeleting } = useDeletePurchaseOrder();

  const showError = (error: unknown): void => {
    toaster.create({
      title: 'No se pudo guardar la orden de compra',
      description: serverErrorMessage(error),
      type: 'error',
      duration: 6000,
      closable: true,
    });
  };

  const refresh = (): void => {
    queryClient.invalidateQueries({
      queryKey: ['purchaseOrders'],
    });
    queryClient.invalidateQueries({
      queryKey: ['purchaseOrder'],
    });
  };

  const onSubmit = (values: ValuesProps): void => {
    save(
      { id: order?.id, body: purchaseOrderBody(values, { editing: !!order }) },
      {
        onError: showError,
        onSuccess: ({ data }) => {
          toaster.create({
            title: order
              ? 'Orden de compra actualizada'
              : 'Orden de compra creada',
            type: 'success',
            duration: 5000,
            closable: true,
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
        toaster.create({
          title: 'Orden de compra eliminada',
          type: 'success',
          duration: 5000,
          closable: true,
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
