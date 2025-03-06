import { expect } from 'vitest';
import { getApplyLogicValue, type FormBrowser } from './Browser';
import type { Selection } from './cms/useTextSelection';

test('return null if result is undefined', () => {
  expect(getApplyLogicValue('initial', undefined, 'ATTRIBUTE', [])).toBeNull();
});

test('return result value wrapped in #{ } if withoutEl is false or undefined', () => {
  const result = { value: 'testValue' };
  const activeBrowsers: FormBrowser[] = [{ type: 'ATTRIBUTE', options: {} }];
  expect(getApplyLogicValue('initial', result, 'ATTRIBUTE', activeBrowsers)).toBe('#{testValue}');
});

test('return result value as is if withoutEl is true', () => {
  const result = { value: 'testValue' };
  const activeBrowsers: FormBrowser[] = [{ type: 'ATTRIBUTE', options: { withoutEl: true } }];
  expect(getApplyLogicValue('initial', result, 'ATTRIBUTE', activeBrowsers)).toBe('testValue');
});

test('override selection when overrideSelection is true', () => {
  const result = { value: 'newContent' };
  const activeBrowsers: FormBrowser[] = [
    { type: 'ATTRIBUTE', options: { overrideSelection: true } },
    { type: 'CMS', options: { withoutEl: true } }
  ];
  const selection: Selection = { start: 3, end: 7 };
  expect(getApplyLogicValue('abcdefg', result, 'ATTRIBUTE', activeBrowsers, selection)).toBe('abc#{newContent}');
});

test('append new value when overrideSelection is true but selection is undefined', () => {
  const result = { value: 'newContent' };
  const activeBrowsers: FormBrowser[] = [{ type: 'ATTRIBUTE', options: { overrideSelection: true } }];
  expect(getApplyLogicValue('existing', result, 'ATTRIBUTE', activeBrowsers)).toBe('existing#{newContent}');
});
