import { Flex } from '@axonivy/ui-components';
import { PaletteItem } from './PaletteItem';
import type { PaletteConfig } from './palette-config';

type PaletteSectionProps = {
  title: string;
  items: PaletteConfig[];
};

export const PaletteSection = ({ items, title }: PaletteSectionProps) => {
  return (
    <>
      <h3>{title}</h3>
      <div className='palette-category-items'>
        <Flex gap={4} style={{ flexWrap: 'wrap' }}>
          {items.map(item => (
            <PaletteItem key={item.name} item={item} />
          ))}
        </Flex>
      </div>
    </>
  );
};
