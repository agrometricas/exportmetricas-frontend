import { UseQueryResult, useQuery } from 'react-query';
import axios from '@/lib/axios';
import { ExportSearchHit } from '@/types/exportSearch';
import { isSearchable } from '@/utils/exportSearch';

export const searchExports = async (q: string): Promise<ExportSearchHit[]> => {
  const { data } = await axios.get<ExportSearchHit[]>('/export/search', {
    params: { q },
  });
  return data;
};

export const useExportSearch = (
  q: string
): UseQueryResult<ExportSearchHit[]> =>
  useQuery(['exportSearch', q], () => searchExports(q), {
    enabled: isSearchable(q),
    keepPreviousData: true,
  });
