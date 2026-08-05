import { useQuery } from '@tanstack/react-query';
import { fetchStockData } from '../service/operations/stockOperations';
import { stockQueryKey } from './queryKeys.js';

export { stockQueryKey };

export const useStockQuery = () =>
  useQuery({
    queryKey: stockQueryKey(),
    queryFn: fetchStockData,
  });
