import test from 'node:test';
import assert from 'node:assert/strict';
import { overviewQueryKey, salesQueryKey, stockQueryKey } from './queryKeys.js';

test('sales query key includes the requested date range', () => {
  assert.deepEqual(salesQueryKey({ DtFrom: '2026-01-01', DtTo: '2026-08-05' }), [
    'sales',
    { DtFrom: '2026-01-01', DtTo: '2026-08-05' },
  ]);
});

test('date changes create distinct sales and overview keys', () => {
  assert.notDeepEqual(
    salesQueryKey({ DtFrom: '2026-01-01', DtTo: '2026-08-05' }),
    salesQueryKey({ DtFrom: '2026-02-01', DtTo: '2026-08-05' })
  );
  assert.notDeepEqual(
    overviewQueryKey({ DtFrom: '2026-01-01', DtTo: '2026-08-05' }),
    overviewQueryKey({ DtFrom: '2026-01-01', DtTo: '2026-08-04' })
  );
});

test('stock query key is stable', () => {
  assert.deepEqual(stockQueryKey(), ['stock']);
  assert.deepEqual(stockQueryKey(), stockQueryKey());
});
