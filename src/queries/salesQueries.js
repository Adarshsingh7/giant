import { useQuery } from '@tanstack/react-query';
import {
  fetchOverviewData,
  fetchSalesData,
} from '../service/operations/salesOperations';
import { overviewQueryKey, salesQueryKey } from './queryKeys.js';

export { overviewQueryKey, salesQueryKey };

export const useSalesQuery = ({ DtFrom, DtTo }) =>
  useQuery({
    queryKey: salesQueryKey({ DtFrom, DtTo }),
    queryFn: () => fetchSalesData({ DtFrom, DtTo }),
    enabled: Boolean(DtFrom && DtTo),
    placeholderData: (previousData) => previousData,
  });

export const useOverviewQuery = ({ DtFrom, DtTo }) =>
  useQuery({
    queryKey: overviewQueryKey({ DtFrom, DtTo }),
    queryFn: () => fetchOverviewData({ DtFrom, DtTo }),
    enabled: Boolean(DtFrom && DtTo),
    placeholderData: (previousData) => previousData,
  });
