import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { RequiredCertificateType } from '@/types/box-brand/specifications/requiredCertificate';
import { serializeQueryResult } from '@/utils/serializeQueryResult';

export const getRequiredCertificate = ({
  certificateId,
}: {
  certificateId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/box-brand/certificate/${certificateId}`);
};

type QueryFnType = typeof getRequiredCertificate;

type UseRequiredCertificateOptions = {
  certificateId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useRequiredCertificate = ({
  certificateId,
}: UseRequiredCertificateOptions): UseQueryResult<RequiredCertificateType> => {
  const result = useQuery({
    queryKey: ['requiredCertificate', certificateId],
    queryFn: () => getRequiredCertificate({ certificateId }),
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(
    result
  ) as UseQueryResult<RequiredCertificateType>;
};
