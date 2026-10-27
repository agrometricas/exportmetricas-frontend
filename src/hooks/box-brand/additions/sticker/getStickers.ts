import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listStickers(): Promise<AxiosResponse> {
  return axios.get('/box-brand/sticker');
}

export function useStickers(): ReturnType<typeof serializeQueryResult> {
  const result = useQuery({
    queryKey: ['stickers'],
    queryFn: () => listStickers(),
  });

  return serializeQueryResult(result);
}
