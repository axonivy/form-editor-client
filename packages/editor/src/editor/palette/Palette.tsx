import './Palette.css';
import { Flex, SearchInput, Separator } from '@axonivy/ui-components';
import { useState } from 'react';
import { PaletteItem, type PaletteConfig } from './PaletteItem';
import { useBase } from '../../components/blocks/base';

export type PaletteProps = {
  sections: Record<string, PaletteConfig[]>;
  directCreate?: (name: string) => void;
};

export const Palette = ({ sections, directCreate }: PaletteProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { CategoryTranslations } = useBase();
  return (
    <Flex direction='column' className='palette' gap={3}>
      <SearchInput placeholder='Search...' value={searchTerm} onChange={setSearchTerm} />
      {Object.entries(sections).map(([section, sectionItems]) => {
        const filteredItems = sectionItems.filter(item => item.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filteredItems.length > 0) {
          return <PaletteSection key={section} items={filteredItems} title={CategoryTranslations[section]} directCreate={directCreate} />;
        }
        return null;
      })}
    </Flex>
  );
};

type PaletteSectionProps = {
  title: string;
  items: Array<PaletteConfig>;
  directCreate?: (name: string) => void;
};

const PaletteSection = ({ items, title, directCreate }: PaletteSectionProps) => (
  <>
    <h3 className='palette-section-title'>{title}</h3>
    <Flex gap={4} style={{ flexWrap: 'wrap' }}>
      {items.map(item => (
        <PaletteItem key={item.name} {...item} directCreate={directCreate} />
      ))}
    </Flex>
    <Separator style={{ marginBlock: 'var(--size-2)' }} />
  </>
);
