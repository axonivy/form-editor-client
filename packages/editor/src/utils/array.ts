export const groupBy = <TElement, TGroup extends string>(arr: Array<TElement>, fn: (item: TElement) => TGroup) => {
  return arr.reduce<Record<TGroup, Array<TElement>>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {} as Record<TGroup, Array<TElement>>);
};

export const move = <T extends object>(arr: Array<T>, fromIndex: number, toIndex: number) => {
  const element = remove(arr, fromIndex);
  add(arr, element, toIndex);
};

export const remove = <T extends object>(arr: Array<T>, index: number) => {
  return arr.splice(index, 1)[0];
};

export const add = <T extends object>(arr: Array<T>, element: T, index: number) => {
  arr.splice(index, 0, element);
};
