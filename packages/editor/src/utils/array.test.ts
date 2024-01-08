import { groupBy, move } from './array';

const car1 = { type: 'suv', vendor: 'bmw' } as const;
const car2 = { type: 'suv', vendor: 'volvo', price: 1000 } as const;
const car3 = { type: 'combi', vendor: 'bmw', price: 500 } as const;

describe('array util', () => {
  test('groupBy', () => {
    expect(groupBy([], () => 'bla')).to.deep.equals({});
    expect(groupBy([car1, car2, car3], item => item.type)).to.deep.equals({ combi: [car3], suv: [car1, car2] });
    expect(groupBy([car1, car2, car3], item => item.vendor)).to.deep.equals({ bmw: [car1, car3], volvo: [car2] });
  });

  test('move', () => {
    const array = [{ a: 1 }, { a: 2 }];
    expect(array).toEqual(array);
    move(array, 0, 1);
    expect(array).toEqual([{ a: 2 }, { a: 1 }]);
  });
});
