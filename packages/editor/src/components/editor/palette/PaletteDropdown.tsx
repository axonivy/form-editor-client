import './PaletteDropdown.css';
import type { PaletteDetails } from './Palette';
import { PaletteItem } from './PaletteItem';

// TODO: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown

export const PaletteDropdown = (category: PaletteDetails) => {
  const dropdownId = 'dropdown-' + category.name;
  const changeVisibility = (visibility: 'visible' | 'collapsed') => {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    dropdown.style.visibility = visibility;
  };
  return (
    <div className='palette-dropdown' onClick={() => changeVisibility('visible')}>
      <div className='dropdown-title'>{category.name}</div>
      <div className='dropdown-items' id={dropdownId} onBlur={() => changeVisibility('collapsed')}>
        {category.items.map(item => (
          <PaletteItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
};
