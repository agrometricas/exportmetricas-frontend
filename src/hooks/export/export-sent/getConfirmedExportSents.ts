import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from '@/lib/axios';
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
    queryKey: ['confirmedExportSents'],
    queryFn: getConfirmedExportSents,
  });
};
