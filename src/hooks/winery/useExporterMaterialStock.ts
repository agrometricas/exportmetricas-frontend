import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { ExporterMaterialStock } from '../../types/winery/exporterMaterialStock';

export const getExporterMaterialStock = async ({
  exporterId,
  materialType,
  materialId,
}: {
  exporterId: number;
  materialType: string;
  materialId: number;
}): Promise<ExporterMaterialStock> => {
  const { data } = await axios.get(
    `/exporter-material-stock/by-exporter-and-material`,
    {
      params: {
        exporterId,
        materialType,
        materialId,
      },
    }
  );
  return data;
};

export const useExporterMaterialStock = ({
  exporterId,
  materialType,
  materialId,
}: {
  exporterId: number;
  materialType: string;
  materialId: number;
}): UseQueryResult<ExporterMaterialStock, unknown> => {
  return useQuery({
    queryKey: ['exporterMaterialStock', exporterId, materialType, materialId],
    queryFn: () =>
      getExporterMaterialStock({ exporterId, materialType, materialId }),
    enabled: !!exporterId && !!materialType && !!materialId,
  });
};
