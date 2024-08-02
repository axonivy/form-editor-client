import './Palette.css';
import { Flex, SearchInput, Separator } from '@axonivy/ui-components';
import { useState } from 'react';
import { PaletteItem, type PaletteConfig } from './PaletteItem';

export type PaletteProps = {
  sections: Record<string, PaletteConfig[]>;
};

export const Palette = ({ sections }: PaletteProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <Flex direction='column' className='palette'>
      <SearchInput placeholder='Search...' value={searchTerm} onChange={setSearchTerm} />
      {Object.entries(sections).map(([section, sectionItems]) => {
        const filteredItems = sectionItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filteredItems.length > 0) {
          return <PaletteSection key={section} items={filteredItems} title={section} />;
        }
        return null;
      })}
    </Flex>
  );
};

type PaletteSectionProps = {
  title: string;
  items: Array<PaletteConfig>;
};

const PaletteSection = ({ items, title }: PaletteSectionProps) => {
  return (
    <>
      <h3>{title}</h3>
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {items.map(item => (
          <PaletteItem key={item.name} {...item} />
        ))}
      </Flex>
      <Separator />
    </>
  );
};
