import { useMemo } from 'react';
import { useAppContext } from '../../../context/useData';
import { useMeta } from '../../../context/useMeta';
import { Palette } from '../Palette';
import { paletteItems } from './data-class-data';

export const DataClassPalette = () => {
  const { context } = useAppContext();
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const items = useMemo(() => paletteItems(dataClass), [dataClass]);
  return <Palette sections={items} />;
};
