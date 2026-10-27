import { AxiosResponse } from 'axios';
import { UseQueryResult, useQuery } from 'react-query';
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
  const result = useQuery(
    ['exporterMaterials', exporterId],
    () => getExporterMaterials({ exporterId }),
    {
      enabled: !!exporterId,
      keepPreviousData: true,
    }
  );

  return serializeQueryResult(result) as UseQueryResult<ExporterMaterialsType>;
};
