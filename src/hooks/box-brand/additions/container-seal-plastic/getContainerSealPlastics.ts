import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listContainerSealPlastics(): Promise<AxiosResponse> {
  return axios.get('/box-brand/container-seal-plastic');
}

export function useContainerSealPlastics(): ReturnType<
  typeof serializeQueryResult
> {
  const result = useQuery({
    queryKey: ['containerSealPlastics'],
    queryFn: () => listContainerSealPlastics(),
  });

  return serializeQueryResult(result);
}
