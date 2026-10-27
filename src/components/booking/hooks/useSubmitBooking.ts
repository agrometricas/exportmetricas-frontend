import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { toaster } from '@/components/ui/toaster';
import {
  useDeleteBooking,
  useSaveBooking,
} from '../../../hooks/booking/mutateBooking';
import { BookingResponse } from '../../../types/booking';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import { bookingBody } from '../bookingBody';
import {
  initialValues,
  validationSchema,
  ValuesProps,
  valuesFromBooking,
} from '../schemas/booking.schema';

const LIST_PATH = '/dashboard/export/bookings';

export function useSubmitBooking(booking?: BookingResponse): {
  onSubmit: (values: ValuesProps) => void;
  onDelete: () => void;
  initialValues: ValuesProps;
  validationSchema: typeof validationSchema;
  isLoading: boolean;
  isDeleting: boolean;
} {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: save, isLoading } = useSaveBooking();
  const { mutate: remove, isLoading: isDeleting } = useDeleteBooking();

  const showError = (error: unknown): void => {
    if (isAxiosError(error) && error.response?.status === 401) {
      router.push('/api/auth/signout');
      return;
    }
    toaster.create({
      title: 'No se pudo guardar el booking',
      description: serverErrorMessage(error),
      type: 'error',
      duration: 6000,
      closable: true,
    });
  };

  const done = (title: string): void => {
    toaster.create({ title, type: 'success', duration: 5000, closable: true });
    queryClient.invalidateQueries('bookings');
    queryClient.invalidateQueries('booking');
    queryClient.invalidateQueries('vessels');
    router.push(LIST_PATH);
  };

  const onSubmit = (values: ValuesProps): void => {
    save(
      { id: booking?.id, body: bookingBody(values) },
      {
        onError: showError,
        onSuccess: () =>
          done(booking ? 'Booking actualizado' : 'Booking creado'),
      }
    );
  };

  const onDelete = (): void => {
    if (!booking) return;
    remove(booking.id, {
      onError: showError,
      onSuccess: () => done('Booking eliminado'),
    });
  };

  return {
    onSubmit,
    onDelete,
    initialValues: booking ? valuesFromBooking(booking) : initialValues,
    validationSchema,
    isLoading,
    isDeleting,
  };
}
