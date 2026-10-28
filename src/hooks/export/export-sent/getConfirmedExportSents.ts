import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { qk } from '@/lib/queryKeys';
import { ExportSentConfirmedCost } from '../../../types/export-sent/exportSentConfirmedCost';

const getConfirmedExportSents = async (): Promise<
  ExportSentConfirmedCost[]
> => {
  const { data } = await axios.get('/export-sent/confirmed-cost');
  return data;
};

export const useConfirmedExportSents = (): UseQueryResult<
  ExportSentConfirmedCost[],
  unknown
> => {
  return useQuery({
    queryKey: qk('confirmedExportSents'),
    queryFn: getConfirmedExportSents,
  });
};
