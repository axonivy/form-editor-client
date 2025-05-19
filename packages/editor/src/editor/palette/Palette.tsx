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
  const filteredSections: Record<string, Array<PaletteConfig>> = {};
  for (const section of Object.keys(sections)) {
    const filteredItems = sections[section].filter(item => item.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filteredItems.length > 0) {
      filteredSections[section] = filteredItems;
    }
  }
  return (
    <Flex direction='column' className='palette' gap={3}>
      <SearchInput placeholder={t('common.label.search')} value={searchTerm} onChange={setSearchTerm} />
      {Object.entries(filteredSections).map(([section, sectionItems]) => (
        <PaletteSection key={section} items={sectionItems} title={CategoryTranslations[section]} directCreate={directCreate} />
      ))}
      {Object.keys(filteredSections).length === 0 && t('message.emptyPalette')}
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
