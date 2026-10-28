import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { BookingResponse } from '../../types/booking';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function getBooking(id: string): Promise<AxiosResponse<BookingResponse>> {
  return axios.get(`/bookings/${id}`);
}

export function useBooking(
  id: string
): UseQueryResult<BookingResponse, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['booking', id],
      queryFn: () => getBooking(id),
      enabled: Boolean(id),
    })
  );
}
