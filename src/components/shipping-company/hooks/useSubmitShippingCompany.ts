import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { useCreateShippingCompany } from '@/hooks/export/shippingCompany/createShippingCompany';
import { ServerErrorResponse } from '../../../types/errorResponse';
import { serverErrorMessage } from '../../../utils/serverErrorMessage';
import {
  validationSchema,
  initialValues,
  ValuesProps,
} from '../schemas/shippingCompany.schema';

export function useSubmitShippingCompany(): {
  onSubmit: (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ) => Promise<void>;
  validationSchema: typeof validationSchema;
  initialValues: typeof initialValues;
  isLoading: boolean;
} {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createShippingCompany, isLoading } =
    useCreateShippingCompany();

  const onSubmit = async (
    values: ValuesProps,
    formikHelpers: FormikHelpers<ValuesProps>
  ): Promise<void> => {
    const { harbors, contacts, ...rest } = values;
    const toNumber = (v: number | '' | null | undefined): number | null =>
      v === '' || v == null ? null : Number(v);

    const normalizedHarbors =
      (harbors || [])
        .map((h) => ({
          harborDepartureId: toNumber(h.harborDepartureId),
          harborDestinationId: toNumber(h.harborDestinationId),
          estDuration: (h.estDuration || '').trim(),
        }))
        .filter(
          (h) =>
            h.harborDepartureId !== null &&
            h.harborDestinationId !== null &&
            h.estDuration.length > 0
        )
        .map((h) => ({
          harborDepartureId: h.harborDepartureId as number,
          harborDestinationId: h.harborDestinationId as number,
          estDuration: h.estDuration,
        })) || undefined;

    const normalizedContacts = (contacts || []).map((c) => ({
      name: (c.name || '').trim(),
      email: (c.email || '').trim(),
      phone: (c.phone || '').trim(),
    }));

    const trackingPlatform = (rest.trackingPlatform || '').trim() || undefined;

    const payload = {
      name: rest.name.trim(),
      code: rest.code.trim(),
      countryId: Number(rest.countryId),
      frequencies: rest.frequencies.trim(),
      cargoType: rest.cargoType as
        | 'Contenedores Refrigerados'
        | 'Carga al Granel',
      trackingPlatform,
      contacts: normalizedContacts,
      ...(normalizedHarbors && normalizedHarbors.length
        ? { harbors: normalizedHarbors }
        : {}),
    };

    createShippingCompany(payload, {
      onError: (error: AxiosError<ServerErrorResponse>) => {
        const statusCode = error.response?.status;
        toast({
          title: 'No se pudo guardar',
          description: serverErrorMessage(error),
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
          title: 'Naviero Creado con éxito',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        queryClient.invalidateQueries('shipping-companies');
        formikHelpers.resetForm();
        router.push('/dashboard/client/shipping-companies');
      },
    });
  };

  return {
    onSubmit,
    validationSchema,
    initialValues,
    isLoading,
  };
}
