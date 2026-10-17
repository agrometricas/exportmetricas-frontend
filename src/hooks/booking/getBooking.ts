import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { BookingResponse } from '../../types/booking';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function getBooking(id: string): Promise<AxiosResponse<BookingResponse>> {
  return axios.get(`/bookings/${id}`);
}

export function useBooking(
  id: string
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(['booking', id], () => getBooking(id), { enabled: Boolean(id) })
  );
}
