import { toAmount, ValuesProps } from './schemas/shippingContract.schema';
import { ShippingContractBody } from '../../types/shippingContract';

// The shipping company of a contract does not change, and the backend rejects
// any field its edit DTO does not declare.
export function shippingContractBody(
  values: ValuesProps,
  { withShippingCompany }: { withShippingCompany: boolean }
): ShippingContractBody {
  return {
    ...(withShippingCompany
      ? { shippingCompanyId: Number(values.shippingCompanyId) }
      : {}),
    reference: values.reference.trim() || null,
    startDate: values.startDate,
    endDate: values.endDate,
    routes: values.routes.map((route) => ({
      harborDepartureId: Number(route.harborDepartureId),
      harborDestinationId: Number(route.harborDestinationId),
      costPerContainer: toAmount(route.costPerContainer),
      transitDays: route.transitDays ? Number(route.transitDays) : null,
    })),
  };
}
