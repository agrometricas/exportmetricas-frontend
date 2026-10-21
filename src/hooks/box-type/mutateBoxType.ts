import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import axios from '../../lib/axios';
import {
  BoxBrandCargoBody,
  BoxTypeBody,
  BoxTypeResponse,
} from '../../types/boxType';
import { ServerErrorResponse } from '../../types/errorResponse';

type Saved = AxiosResponse<BoxTypeResponse>;
type SaveInput = { id?: number; body: BoxTypeBody };

function saveBoxType({ id, body }: SaveInput): Promise<Saved> {
  return id
    ? axios.patch(`/box-types/${id}`, body)
    : axios.post('/box-types', body);
}

export function useSaveBoxType(): UseMutationResult<
  Saved,
  AxiosError<ServerErrorResponse>,
  SaveInput
> {
  return useMutation(saveBoxType);
}

function deleteBoxType(id: number): Promise<AxiosResponse<{ id: number }>> {
  return axios.delete(`/box-types/${id}`);
}

export function useDeleteBoxType(): UseMutationResult<
  AxiosResponse<{ id: number }>,
  AxiosError<ServerErrorResponse>,
  number
> {
  return useMutation(deleteBoxType);
}

type CargoInput = { boxBrandId: number; body: BoxBrandCargoBody };

function updateBoxBrandCargo({
  boxBrandId,
  body,
}: CargoInput): Promise<AxiosResponse> {
  return axios.patch(`/box-brand/${boxBrandId}/cargo`, body);
}

export function useUpdateBoxBrandCargo(): UseMutationResult<
  AxiosResponse,
  AxiosError<ServerErrorResponse>,
  CargoInput
> {
  return useMutation(updateBoxBrandCargo);
}
