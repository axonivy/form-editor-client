import { add, move, remove } from './array';

test('move', () => {
  const array = [{ a: 1 }, { a: 2 }];
  expect(array).toEqual(array);
  move(array, 0, 1);
  expect(array).toEqual([{ a: 2 }, { a: 1 }]);
});

test('remove', () => {
  const arr1 = [{ a: 1 }, { a: 2 }];
  const element1 = remove(arr1, 0);
  expect(arr1).toEqual([{ a: 2 }]);
  expect(element1).toEqual({ a: 1 });

  const arr2 = [{ a: 1 }, { a: 2 }];
  const element2 = remove(arr2, 1);
  expect(arr2).toEqual([{ a: 1 }]);
  expect(element2).toEqual({ a: 2 });
});

test('add', () => {
  const array = [{ a: 1 }, { a: 2 }];
  expect(array).toEqual(array);

  add(array, { a: 3 }, 0);
  expect(array).toEqual([{ a: 3 }, { a: 1 }, { a: 2 }]);

  add(array, { a: 4 }, 2);
  expect(array).toEqual([{ a: 3 }, { a: 1 }, { a: 4 }, { a: 2 }]);
});
