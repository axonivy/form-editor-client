import type { PaletteConfig } from './palette-config';
import './Palette.css';
import { PaletteDropdown } from './PaletteDropdown';

type PaletteProps = {
  items: Record<string, PaletteConfig[]>;
};

export type PaletteDetails = {
  name: string;
  items: PaletteConfig[];
};

export const Palette = ({ items }: PaletteProps) => {
  return (
    <div className='palette'>
      {Object.entries(items).map(([category, groupItems]) => (
        <div key={category} className='palette-category'>
          <div className='palette-category-items'>
            <PaletteDropdown name={category} items={groupItems} />
          </div>
        </div>
      ))}
    </div>
  );
};