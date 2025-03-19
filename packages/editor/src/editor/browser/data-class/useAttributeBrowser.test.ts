import { expect } from 'vitest';
import { getApplyModifierValue } from './useAttributeBrowser';
import type { Row } from '@tanstack/react-table';
import type { BrowserNode } from '@axonivy/ui-components';

const row = {
  original: { value: 'country', info: 'String' },
  getParentRows: () => [{ original: { value: 'data' } }, { original: { value: 'address' } }, { original: { value: 'location' } }]
} as Row<BrowserNode>;

test('return empty value when row is undefined', () => {
  const result = getApplyModifierValue(undefined, false);
  expect(result).toEqual({ value: '' });
});

test('returns full variable path when row is defined and componentInDialog is false', () => {
  const result = getApplyModifierValue(row, false);
  expect(result).toEqual({ value: 'data.address.location.country' });
});
test('returns prefixed variable path when row is defined and componentInDialog is true', () => {
  const result = getApplyModifierValue(row, true);
  expect(result).toEqual({ value: 'genericRowManager.selectedRow.address.location.country' });
});
test('returns partial path when onlyAttributes is COLUMN and componentInDialog is false', () => {
  const result = getApplyModifierValue(row, false, { onlyAttributes: 'COLUMN' });
  expect(result).toEqual({ value: 'address.location.country' });
});

test('returns only prefix when row has no parents and componentInDialog is true', () => {
  const result = getApplyModifierValue(
    {
      original: { value: 'variable', info: 'String' },
      getParentRows: () => [{}]
    } as Row<BrowserNode>,
    true
  );
  expect(result).toEqual({ value: 'genericRowManager.selectedRow' });
});

test('returns only row value when onlyAttributes is COLUMN and row has no parents', () => {
  const result = getApplyModifierValue(
    {
      original: { value: 'data', info: 'String' },
      getParentRows: () => [{}]
    } as Row<BrowserNode>,
    false,
    { onlyAttributes: 'COLUMN' }
  );
  expect(result).toEqual({ value: 'data' });
});
