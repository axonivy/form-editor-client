import type { PaletteConfig } from './palette-config';
import './Palette.css';
import { Flex, SearchInput, Separator } from '@axonivy/ui-components';
import { useMemo, useState } from 'react';
import { PaletteSection } from './PaletteSection';
import { useAppContext } from '../../../context/useData';
import { useMeta } from '../../../context/useMeta';
import { componentByName } from '../../components';

export type PaletteProps = {
  items: Record<string, PaletteConfig[]>;
};

export const Palette = ({ items }: PaletteProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <Flex direction='column' className='palette'>
      <SearchInput placeholder='Search...' value={searchTerm} onChange={setSearchTerm} />
      {Object.entries(items).map(([category, groupItems], index) => {
        const filteredItems = groupItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filteredItems.length > 0) {
          return (
            <div key={category}>
              {index !== 0 && <Separator />}
              <PaletteSection items={filteredItems} title={category} />
            </div>
          );
        }
        return null;
      })}
    </Flex>
  );
};

export const DataClassPalette = () => {
  const { context } = useAppContext();
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const items = useMemo(() => {
    if (dataClass === undefined || dataClass.variables.length === 0) {
      return {};
    }
    const i: Record<string, PaletteConfig[]> = {};
    dataClass.types[dataClass.variables[0].type].forEach(type => (i[type.attribute] = [componentByName('Input')]));
    return i;
  }, [dataClass]);
  return <Palette items={items} />;
};
