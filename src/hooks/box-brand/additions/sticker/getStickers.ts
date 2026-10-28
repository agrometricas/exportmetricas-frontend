import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { StickerType } from '@/types/box-brand/additions/sticker';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listStickers(): Promise<AxiosResponse<StickerType[]>> {
  return axios.get('/box-brand/sticker');
}

export function useStickers(): UseQueryResult<StickerType[], unknown> {
  const result = useQuery({
    queryKey: ['stickers'],
    queryFn: () => listStickers(),
  });

  return serializeQueryResult(result);
}
