import './Palette.css';
import { Flex, SearchInput, Separator } from '@axonivy/ui-components';
import { useState } from 'react';
import { PaletteItem, type PaletteConfig } from './PaletteItem';
import { useBase } from '../../components/blocks/base';
import { useTranslation } from 'react-i18next';

export type PaletteProps = {
  sections: Record<string, PaletteConfig[]>;
  directCreate?: (name: string) => void;
};

export const Palette = ({ sections, directCreate }: PaletteProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { categoryTranslations: CategoryTranslations } = useBase();
  return (
    <Flex direction='column' className='palette' gap={3}>
      <SearchInput placeholder={t('common:label.search')} value={searchTerm} onChange={setSearchTerm} />
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
