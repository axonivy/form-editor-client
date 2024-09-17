import { useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { Palette } from '../Palette';
import { paletteItems } from './composite-data';

export const CompositePalette = () => {
  const { context } = useAppContext();
  const composites = useMeta('meta/composite/all', context, []).data;
  const items = useMemo(() => paletteItems(composites), [composites]);
  return <Palette sections={items} />;
};
