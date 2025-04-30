import { renderHook } from '@testing-library/react';
import { useExtractFieldValidation } from './useExtractFieldValidation';

test('valid Component names', () => {
  const { result } = renderHook(() => useExtractFieldValidation());
  const { validateComponentName } = result.current;
  const validNames = ['ValidName', 'M', 'M1', 'A_', 'A_b'];
  for (const name of validNames) {
    expect(validateComponentName(name)).toBeUndefined();
  }
});

test('invalid Component names', async () => {
  const { result } = renderHook(() => useExtractFieldValidation());
  const { validateComponentName } = result.current;
  expect(validateComponentName()).toEqual({ message: `message.componentNotEmpty`, variant: 'error' });
  expect(validateComponentName('')).toEqual({ message: `message.componentNotEmpty`, variant: 'error' });
  expect(validateComponentName('abstract')).toEqual({ message: `Input 'abstract' is a reserved keyword.`, variant: 'error' });
  expect(validateComponentName('1First')).toEqual({ message: 'message.invalidChar', variant: 'error' });
  expect(validateComponentName('Last-')).toEqual({ message: 'message.invalidChar', variant: 'error' });
  expect(validateComponentName('em-bedded')).toEqual({ message: 'message.invalidChar', variant: 'error' });

  const invalidNames = [' ', ' SpacePrefix', 'SpaceSuffix ', 'Space Infix', '1', '-', '_', '_a'];
  for (const name of invalidNames) {
    expect(validateComponentName(name)?.variant).toBe('error');
  }
});

test('valid dot separated namespaces', () => {
  const { result } = renderHook(() => useExtractFieldValidation());
  const { validateComponentNamespace } = result.current;
  const validNamespaces = ['ValidOne', 'othervalid', 'm', 'M', 'M1', 'A_', 'A_b', 'a.b', 'a.b.c_'];
  for (const namespace of validNamespaces) {
    expect(validateComponentNamespace(namespace)).toBeUndefined();
  }
});

test('invalid dot separated namespaces', () => {
  const { result } = renderHook(() => useExtractFieldValidation());
  const { validateComponentNamespace } = result.current;
  const invalidNamespaces = ['', undefined, ' ', '1', '-', '_', '_a', 'abc-abc', 'abc.', 'abc/', 'abc/abc'];
  for (const namespace of invalidNamespaces) {
    expect(validateComponentNamespace(namespace)?.variant).toBe('error');
  }
});
