import { PaletteItem } from './PaletteItem';
import type { PaletteConfig } from './palette-config';
import './Palette.css';
import { IvyIcons } from '@axonivy/editor-icons';

type PaletteProps = {
  items: Record<string, PaletteConfig[]>;
};

export const Palette = ({ items }: PaletteProps) => {
  return (
    <div className='palette'>
      {Object.entries(items).map(([category, groupItems]) => (
        <div key={category} className='palette-category'>
          <span className='palette-category-title'>
            <i className={`ivy ivy-${IvyIcons.Home}`} />
            {category}
          </span>
          <div className='palette-category-items'>
            {groupItems.map(item => (
              <PaletteItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
