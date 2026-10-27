import { AxiosResponse } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import axios from '@/lib/axios';
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
  const result = useQuery(
    ['exporterMaterialStock', exporterId],
    () => getExporterMaterialStock({ exporterId }),
    { keepPreviousData: true, enabled: exporterId > 0 }
  );

  return serializeQueryResult(result) as UseQueryResult<
    ExporterMaterialStock[]
  >;
};
