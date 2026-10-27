import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import axios from '@/lib/axios';
import { StickerType } from '../../../../types/box-brand/additions/sticker';
import { ServerErrorResponse } from '../../../../types/errorResponse';

interface CreateStickerResponse {
  stickerId: string;
}

export const createSticker = (
  data: Partial<StickerType>
): Promise<CreateStickerResponse> => {
  return axios.post('/box-brand/sticker', data);
};

export const useCreateSticker = (
  config?: UseMutationOptions<
    CreateStickerResponse,
    AxiosError<ServerErrorResponse>,
    Partial<StickerType>
  >
): UseMutationResult<
  CreateStickerResponse,
  AxiosError<ServerErrorResponse>,
  Partial<StickerType>
> => {
  return useMutation({
    mutationFn: createSticker,
    ...config,
  });
};
