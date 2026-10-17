import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../lib/axios';
import { BookingBody, BookingResponse } from '../../types/booking';
import { ServerErrorResponse } from '../../types/errorResponse';

type Saved = AxiosResponse<BookingResponse>;
type SaveInput = { id?: number; body: BookingBody };

function saveBooking({ id, body }: SaveInput): Promise<Saved> {
  return id
    ? axios.patch(`/bookings/${id}`, body)
    : axios.post('/bookings', body);
}

export function useSaveBooking(): UseMutationResult<
  Saved,
  AxiosError<ServerErrorResponse>,
  SaveInput
> {
  return useMutation(saveBooking);
}

function deleteBooking(id: number): Promise<AxiosResponse<{ id: number }>> {
  return axios.delete(`/bookings/${id}`);
}

export function useDeleteBooking(): UseMutationResult<
  AxiosResponse<{ id: number }>,
  AxiosError<ServerErrorResponse>,
  number
> {
  return useMutation(deleteBooking);
}
