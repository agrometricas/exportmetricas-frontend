import {
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '../../lib/axios';
import {
  BookingDocument,
  DocumentTypeOption,
} from '../../types/bookingDocument';
import { ServerErrorResponse } from '../../types/errorResponse';
import { serializeQueryResult } from '../../utils/serializeQueryResult';

export function useBookingDocuments(
  bookingId: number
): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['bookingDocuments', bookingId],
      queryFn: (): Promise<AxiosResponse<BookingDocument[]>> =>
        axios.get(`/bookings/${bookingId}/documents`),
      enabled: Boolean(bookingId),
    })
  );
}

export function useDocumentTypes(): ReturnType<typeof serializeQueryResult> {
  return serializeQueryResult(
    useQuery({
      queryKey: ['bookingDocumentTypes'],
      queryFn: (): Promise<AxiosResponse<DocumentTypeOption[]>> =>
        axios.get('/bookings/document-types'),
    })
  );
}

type UploadInput = { bookingId: number; body: FormData };

function uploadBookingDocument({
  bookingId,
  body,
}: UploadInput): Promise<AxiosResponse<BookingDocument>> {
  return axios.post(`/bookings/${bookingId}/documents`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function useUploadBookingDocument(): UseMutationResult<
  AxiosResponse<BookingDocument>,
  AxiosError<ServerErrorResponse>,
  UploadInput
> {
  return useMutation({ mutationFn: uploadBookingDocument });
}

type DeleteInput = { bookingId: number; documentId: number };

function deleteBookingDocument({
  bookingId,
  documentId,
}: DeleteInput): Promise<AxiosResponse<{ id: number }>> {
  return axios.delete(`/bookings/${bookingId}/documents/${documentId}`);
}

export function useDeleteBookingDocument(): UseMutationResult<
  AxiosResponse<{ id: number }>,
  AxiosError<ServerErrorResponse>,
  DeleteInput
> {
  return useMutation({ mutationFn: deleteBookingDocument });
}
