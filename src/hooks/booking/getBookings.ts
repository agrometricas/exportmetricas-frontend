import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { BookingResponse } from '../../types/booking';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listBookings(): Promise<AxiosResponse<BookingResponse[]>> {
  return axios.get('/bookings');
}

export function useBookings(): UseQueryResult<BookingResponse[], unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('bookings'),
      queryFn: listBookings,
    })
  );
}
