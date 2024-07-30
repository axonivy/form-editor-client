import { labelText } from './string';

test('labelText', () => {
  expect(labelText('')).equals('');
  expect(labelText('test')).equals('Test');
  expect(labelText('Test')).equals('Test');
  expect(labelText('a cool day')).equals('A cool day');
  expect(labelText('aCoolDay')).equals('A Cool Day');
  expect(labelText('MyVar')).equals('My Var');
});
