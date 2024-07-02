import { PaletteItem } from './PaletteItem';
import type { PaletteConfig } from './palette-config';
import './Palette.css';

type PaletteSectionProps = {
  title: string;
  items: PaletteConfig[];
};

export const PaletteSection = ({ items, title }: PaletteSectionProps) => {
  return (
    <>
      <h3>{title}</h3>
      <div className='palette-category-items'>
        <div className='palette-items-grid'>
          {items.map(item => (
            <PaletteItem key={item.name} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};
