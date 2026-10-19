import { useQuery } from 'react-query';
import axios from '@/lib/axios';
import {
  ContractUsage,
  ContractUsageCheck,
  ContractUsageCheckParams,
} from '@/types/contractUsage';
import { useDebouncedValue } from '../useDebouncedValue';

const TYPING_PAUSE_MS = 300;

export function useContractUsage(week: string | null): {
  usage: ContractUsage | undefined;
  isLoading: boolean;
} {
  const { data, isLoading } = useQuery<ContractUsage>(
    ['contractUsage', week],
    async () => (await axios.get('/contract-usage', { params: { week } })).data,
    { enabled: week !== null }
  );
  return { usage: data, isLoading };
}

export function useContractUsageCheck(
  params: ContractUsageCheckParams | null
): ContractUsageCheck | undefined {
  const settled = useDebouncedValue(
    params ? JSON.stringify(params) : null,
    TYPING_PAUSE_MS
  );
  const { data } = useQuery<ContractUsageCheck>(
    ['contractUsageCheck', settled],
    async () =>
      (
        await axios.get('/contract-usage/check', {
          params: JSON.parse(settled as string),
        })
      ).data,
    { enabled: settled !== null, keepPreviousData: true, retry: false }
  );
  return params ? data : undefined;
}
