import { ValuesProps } from './schemas/producerContract.schema';
import { ProducerContractBody } from '../../types/producerContract';

// The producer is only there to pick the farm; the backend reads it from the
// farm and rejects any field its DTO does not declare.
export function producerContractBody(
  values: ValuesProps,
  { withBusiness }: { withBusiness: boolean }
): ProducerContractBody {
  return {
    ...(withBusiness ? { businessId: Number(values.businessId) } : {}),
    approvedHectares: Number(values.approvedHectares),
    approvedWeeklyBoxesPerHectare: Number(values.approvedWeeklyBoxesPerHectare),
    weeklyContainers: Number(values.weeklyContainers),
    price: Number(values.price),
    contractType: values.contractType || null,
    startDate: values.startDate,
    endDate: values.endDate || null,
  };
}
