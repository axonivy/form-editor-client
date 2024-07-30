import './Palette.css';
import { Flex, SearchInput, Separator } from '@axonivy/ui-components';
import { useMemo, useState } from 'react';
import { useAppContext } from '../../../context/useData';
import { useMeta } from '../../../context/useMeta';
import { componentsByType } from '../../components';
import type { Variable } from '@axonivy/form-editor-protocol';
import { PaletteItem, type PaletteConfig } from './PaletteItem';
import { labelText } from '../../../utils/string';

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

export const DataClassPalette = () => {
  const { context } = useAppContext();
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const items = useMemo(() => {
    if (dataClass === undefined || dataClass.variables.length === 0) {
      return {};
    }
    const rootClass = dataClass.variables[0];
    return {
      [rootClass.simpleType]: dataClass.types[dataClass.variables[0].type].map(variable => toPaletteConfig(variable)).filter(Boolean)
    };
  }, [dataClass]);
  return <Palette sections={items} />;
};

const toPaletteConfig = (variable: Variable): PaletteConfig => {
  const components = componentsByType(variable.type);
  const paletteConfigs = components.map<PaletteConfig>(component => ({
    ...component,
    name: variable.attribute,
    description: variable.description,
    data: { componentName: component.name, label: labelText(variable.attribute), value: `data.${variable.attribute}` }
  }));
  return paletteConfigs[0];
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
