import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PromiseValue } from 'type-fest';

export type ExtractFnReturnType<FnType extends (...args: never) => unknown> =
  PromiseValue<ReturnType<FnType>>;

export type QueryConfig<QueryFnType extends (...args: never) => unknown> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: never) => unknown> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;
