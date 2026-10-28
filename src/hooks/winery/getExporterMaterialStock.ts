import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { QueryConfig } from '@/lib/react-query';
import { serializeQueryResult } from '@/utils/serializeQueryResult';
import { ExporterMaterialStock } from '../../types/winery/exporterMaterialStock.response';

export const getExporterMaterialStock = ({
  exporterId,
}: {
  exporterId: number;
}): Promise<AxiosResponse> => {
  return axios.get(`/exporter-material-stock/exporter/${exporterId}`);
};

type QueryFnType = typeof getExporterMaterialStock;

type UseExporterMaterialStockOptions = {
  exporterId: number;
  config?: QueryConfig<QueryFnType>;
};

export const useExporterMaterialStock = ({
  exporterId,
}: UseExporterMaterialStockOptions): UseQueryResult<
  ExporterMaterialStock[]
> => {
  const result = useQuery({
    queryKey: qk('exporterMaterialStock', exporterId),
    queryFn: () => getExporterMaterialStock({ exporterId }),
    enabled: exporterId > 0,
    placeholderData: keepPreviousData,
  });

  return serializeQueryResult(result) as UseQueryResult<
    ExporterMaterialStock[]
  >;
};
