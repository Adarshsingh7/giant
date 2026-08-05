import test from 'node:test';
import assert from 'node:assert/strict';
import { filterByMpn, sortRows } from './dataFilters.js';

test('filterByMpn supports partial and case-insensitive MPN values', () => {
  const rows = [{ mpn: 'ABC-123' }, { mpn: 'XYZ-999' }, { mpn: null }];

  assert.deepEqual(filterByMpn(rows, 'bc-1'), [{ mpn: 'ABC-123' }]);
});

test('filterByMpn does not mutate the source array', () => {
  const rows = [{ mpn: 'ABC' }];

  assert.notStrictEqual(filterByMpn(rows, ''), rows);
});

test('sortRows sorts ascending and descending without mutating input', () => {
  const rows = [{ mpn: 'B' }, { mpn: 'A' }];

  assert.deepEqual(sortRows(rows, { key: 'mpn', direction: 'asc' }), [
    { mpn: 'A' },
    { mpn: 'B' },
  ]);
  assert.deepEqual(sortRows(rows, { key: 'mpn', direction: 'desc' }), [
    { mpn: 'B' },
    { mpn: 'A' },
  ]);
});
