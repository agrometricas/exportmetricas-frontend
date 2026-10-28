import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { RequiredCertificateType } from '@/types/box-brand/specifications/requiredCertificate';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

function listRequiredCertificates(): Promise<
  AxiosResponse<RequiredCertificateType[]>
> {
  return axios.get('/box-brand/certificate');
}

export function useRequiredCertificates(): UseQueryResult<
  RequiredCertificateType[],
  unknown
> {
  const result = useQuery({
    queryKey: ['requiredCertificates'],
    queryFn: () => listRequiredCertificates(),
  });

  return serializeQueryResult(result);
}
