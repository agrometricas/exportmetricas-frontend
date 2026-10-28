import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ContainerSealPlasticType } from '@/types/box-brand/additions/containerSealPlastic';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listContainerSealPlastics(): Promise<
  AxiosResponse<ContainerSealPlasticType[]>
> {
  return axios.get('/box-brand/container-seal-plastic');
}

export function useContainerSealPlastics(): UseQueryResult<
  ContainerSealPlasticType[],
  unknown
> {
  const result = useQuery({
    queryKey: qk('containerSealPlastics'),
    queryFn: () => listContainerSealPlastics(),
  });

  return serializeQueryResult(result);
}
