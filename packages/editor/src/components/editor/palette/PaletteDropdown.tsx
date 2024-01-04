import './PaletteDropdown.css';
import type { PaletteDetails } from './Palette';
import { PaletteItem } from './PaletteItem';

export const PaletteDropdown = (category: PaletteDetails) => {
  return (
    <div className='palette-dropdown'>
      <div className='dropdown-title'>{category.name}</div>
      <div className='dropdown-items'>
        {category.items.map(item => (
          <PaletteItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
};
