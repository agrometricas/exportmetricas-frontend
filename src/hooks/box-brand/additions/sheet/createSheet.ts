import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { SheetType } from '../../../../types/box-brand/additions/sheet';
import { ServerErrorResponse } from '../../../../types/errorResponse';

interface CreateSheetResponse {
  sheetId: string;
}

export const createSheet = (
  data: Partial<SheetType>
): Promise<CreateSheetResponse> => {
  return axios.post('/box-brand/sheet', data);
};

export const useCreateSheet = (
  config?: UseMutationOptions<
    CreateSheetResponse,
    AxiosError<ServerErrorResponse>,
    Partial<SheetType>
  >
): UseMutationResult<
  CreateSheetResponse,
  AxiosError<ServerErrorResponse>,
  Partial<SheetType>
> => {
  return useMutation({
    mutationFn: createSheet,
    ...config,
  });
};
