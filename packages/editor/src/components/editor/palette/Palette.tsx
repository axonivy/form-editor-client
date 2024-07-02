import { PaletteItem } from './PaletteItem';
import type { PaletteConfig } from './palette-config';
import './Palette.css';
import { Flex, SearchInput, Separator } from '@axonivy/ui-components';
import { useState } from 'react';

type PaletteProps = {
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
              <h3>{category}</h3>
              <div className='palette-category-items'>
                <div className='palette-items-grid'>
                  {filteredItems.map(item => (
                    <PaletteItem key={item.name} item={item} />
                  ))}
                </div>
              </div>
            </div>
          );
        }
        return null;
      })}
    </Flex>
  );
};
