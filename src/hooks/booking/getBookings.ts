import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { BookingResponse } from '../../types/booking';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

function listBookings(): Promise<AxiosResponse<BookingResponse[]>> {
  return axios.get('/bookings');
}

export function useBookings(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(useQuery(['bookings'], listBookings));
}
