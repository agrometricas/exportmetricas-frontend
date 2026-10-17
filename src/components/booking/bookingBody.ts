import { normalizeContainer, ValuesProps } from './schemas/booking.schema';
import { BookingBody } from '../../types/booking';
import { atHourMinute } from '../../utils/dayMonthYear';

export function bookingBody(values: ValuesProps): BookingBody {
  return {
    bookingNumber: values.bookingNumber.trim(),
    shippingCompanyId: Number(values.shippingCompanyId),
    harborDepartureId: Number(values.harborDepartureId),
    harborDestinationId: Number(values.harborDestinationId),
    shipName: values.shipName.trim(),
    etd: atHourMinute(values.etdDay, values.etdTime) ?? '',
    containerCount: Number(values.containerCount),
    containers: values.containers
      .filter((number) => number.trim())
      .map(normalizeContainer),
  };
}
