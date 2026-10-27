import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  MRT_PaginationState,
  MRT_RowData,
  MRT_TableOptions,
} from 'material-react-table';
import { useState } from 'react';
import axios from '@/lib/axios';
import { Page } from '@/types/page';
import { useDebouncedValue } from './useDebouncedValue';

const TYPING_PAUSE_MS = 300;
const FIRST_PAGE: MRT_PaginationState = { pageIndex: 0, pageSize: 10 };

export interface PagedList<T extends MRT_RowData> {
  rows: T[];
  error: unknown;
  tableOptions: Partial<MRT_TableOptions<T>>;
}

// The backend pages and searches; the table only asks for what it shows.
// Sorting stays off: sorting one page in the browser would lie about the rest.
export function usePagedList<T extends MRT_RowData>(
  key: string,
  url: string
): PagedList<T> {
  const [pagination, setPagination] = useState(FIRST_PAGE);
  const [globalFilter, setGlobalFilter] = useState('');
  const search = useDebouncedValue(globalFilter.trim(), TYPING_PAUSE_MS);

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: [key, 'page', pagination.pageIndex, pagination.pageSize, search],
    queryFn: async (): Promise<Page<T>> =>
      (
        await axios.get(url, {
          params: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            search: search || undefined,
          },
        })
      ).data,
    placeholderData: keepPreviousData,
  });

  return {
    rows: data?.items ?? [],
    error,
    tableOptions: {
      manualPagination: true,
      manualFiltering: true,
      enableSorting: false,
      rowCount: data?.total ?? 0,
      onPaginationChange: setPagination,
      onGlobalFilterChange: (updater): void => {
        const value =
          typeof updater === 'function' ? updater(globalFilter) : updater;
        setGlobalFilter(value ?? '');
        setPagination((current) => ({ ...current, pageIndex: 0 }));
      },
      state: {
        pagination,
        globalFilter,
        isLoading,
        showProgressBars: isFetching && !isLoading,
      },
    },
  };
}
