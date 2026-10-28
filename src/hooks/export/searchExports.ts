import {
  keepPreviousData,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ExportSearchHit } from '@/types/exportSearch';
import { isSearchable } from '@/utils/exportSearch';

export const searchExports = async (q: string): Promise<ExportSearchHit[]> => {
  const { data } = await axios.get<ExportSearchHit[]>('/export/search', {
    params: { q },
  });
  return data;
};

export const useExportSearch = (q: string): UseQueryResult<ExportSearchHit[]> =>
  useQuery({
    queryKey: qk('exportSearch', q),
    queryFn: () => searchExports(q),
    enabled: isSearchable(q),
    placeholderData: keepPreviousData,
  });
