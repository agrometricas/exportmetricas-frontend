import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { qk } from '@/lib/queryKeys';
import axios from '../../lib/axios';
import { BookingDocumentStatus } from '../../types/shipmentStatus';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

export function useBookingDocumentStatus(
  bookingId: number
): UseQueryResult<BookingDocumentStatus, unknown> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('bookingDocumentStatus', bookingId),
      queryFn: (): Promise<AxiosResponse<BookingDocumentStatus>> =>
        axios.get(`/bookings/${bookingId}/document-status`),
      enabled: Boolean(bookingId),
    })
  );
}

export function useDocumentBoard(): UseQueryResult<
  BookingDocumentStatus[],
  unknown
> {
  return serializeQueryResult(
    useQuery({
      queryKey: qk('documentBoard'),
      queryFn: (): Promise<AxiosResponse<BookingDocumentStatus[]>> =>
        axios.get('/bookings/document-board'),
    })
  );
}
