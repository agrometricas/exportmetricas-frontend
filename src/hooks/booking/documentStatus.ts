import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import axios from '../../lib/axios';
import { BookingDocumentStatus } from '../../types/shipmentStatus';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

export function useBookingDocumentStatus(
  bookingId: number
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(
      ['bookingDocumentStatus', bookingId],
      (): Promise<AxiosResponse<BookingDocumentStatus>> =>
        axios.get(`/bookings/${bookingId}/document-status`),
      { enabled: Boolean(bookingId) }
    )
  );
}

export function useDocumentBoard(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery(
      ['documentBoard'],
      (): Promise<AxiosResponse<BookingDocumentStatus[]>> =>
        axios.get('/bookings/document-board')
    )
  );
}
