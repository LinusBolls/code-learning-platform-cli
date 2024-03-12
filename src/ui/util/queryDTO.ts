import { UseQueryResult } from '@tanstack/react-query';

export interface QueryDTO<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
}

export const toQueryDto = <T>(
  query: UseQueryResult,
  data?: T
): QueryDTO<NonNullable<T>> => ({
  isLoading: query.isLoading,
  isError: query.isLoadingError,
  data: data ?? null,
});
