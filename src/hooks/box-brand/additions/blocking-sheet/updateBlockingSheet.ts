import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { MutationConfig } from '@/lib/react-query';
import { BlockingSheetType } from '@/types/box-brand/additions/blockingSheet';

type updateBlockingSheetDTO = {
  data: Partial<BlockingSheetType>;
  blockingSheetId: string;
};

const updateBlockingSheet = ({
  data,
  blockingSheetId,
}: updateBlockingSheetDTO): Promise<AxiosResponse> => {
  return axios.post(`/box-brand/blocking-sheet/${blockingSheetId}`, data);
};

type UseUpdateBlockingSheetOptions = {
  config?: MutationConfig<typeof updateBlockingSheet>;
};

export const useUpdateBlockingSheet = ({
  config,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
}: UseUpdateBlockingSheetOptions = {}) => {
  const mutation = useMutation({
    ...config,
    mutationFn: updateBlockingSheet,
  });

  return { ...mutation, updateBlockingSheet: mutation.mutateAsync };
};
