import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import { BookingDocumentStatus } from '../../types/shipmentStatus';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

export function useBookingDocumentStatus(
  bookingId: number
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['bookingDocumentStatus', bookingId],
      queryFn: (): Promise<AxiosResponse<BookingDocumentStatus>> =>
        axios.get(`/bookings/${bookingId}/document-status`),
      enabled: Boolean(bookingId),
    })
  );
}

export function useDocumentBoard(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['documentBoard'],
      queryFn: (): Promise<AxiosResponse<BookingDocumentStatus[]>> =>
        axios.get('/bookings/document-board'),
    })
  );
}
