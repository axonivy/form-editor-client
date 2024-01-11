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
        <PaletteDropdown key={category} name={category} items={groupItems} />
      ))}
    </div>
  );
};
