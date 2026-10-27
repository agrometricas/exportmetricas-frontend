import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { QueryConfig } from '@/lib/react-query';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { ExporterMaterialsType } from '../../types/winery/exporterMateriales';

export const getExporterMaterials = ({
  exporterId,
}: {
  exporterId: string;
}): Promise<AxiosResponse> => {
  return axios.get(`/exporter-materials/${exporterId}`);
};

type QueryFnType = typeof getExporterMaterials;

type UseExporterMaterialsOptions = {
  exporterId: string;
  config?: QueryConfig<QueryFnType>;
};

export const useExporterMaterials = ({
  exporterId,
}: UseExporterMaterialsOptions): UseQueryResult<ExporterMaterialsType> => {
  const result = useQuery({
    queryKey: ['exporterMaterials', exporterId],
    queryFn: () => getExporterMaterials({ exporterId }),
    enabled: !!exporterId,
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<ExporterMaterialsType>;
};
