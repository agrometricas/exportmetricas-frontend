import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { QueryConfig } from '@/lib/react-query';
import { ExportSentMaterialResponse } from '@/types/export-sent/exportSentMaterial.response';

type GetExportSentMaterialsParams = {
  exportSentId: string;
};

const getExportSentMaterials = async (
  params: GetExportSentMaterialsParams
): Promise<ExportSentMaterialResponse[]> => {
  const response = await axios.get<ExportSentMaterialResponse[]>(
    `/export-sent-material/${params.exportSentId}`
  );
  return response.data;
};

type UseExportSentMaterialsOptions = {
  exportSentId: string;
  config?: QueryConfig<typeof getExportSentMaterials>;
};

export const useExportSentMaterials = ({
  exportSentId,
  config,
}: UseExportSentMaterialsOptions): UseQueryResult<
  ExportSentMaterialResponse[]
> => {
  return useQuery({
    queryKey: qk('exportSentMaterials', exportSentId),
    queryFn: () => getExportSentMaterials({ exportSentId }),
    placeholderData: keepPreviousData,
    ...config,
  });
};
