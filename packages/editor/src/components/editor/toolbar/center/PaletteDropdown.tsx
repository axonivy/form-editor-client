import './PaletteDropdown.css';
import type { PaletteDetails } from './Palette';
import { PaletteItem } from './PaletteItem';
import { IvyIcons } from '@axonivy/editor-icons';

// TODO: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown

const changeVisibility = (id: string) => {
  hideAll([id]);
  document.getElementById(id)?.classList.toggle('show');
};

window.onclick = event => {
  if (event.target instanceof Element && !event.target.matches('.dropdown-button') && !event.target.matches('.dropdown-items')) {
    hideAll();
  }
};

const hideAll = (toIgnore: string[] = []) => {
  const allDropdown = document.getElementsByClassName('dropdown-items');
  for (let i = 0; i < allDropdown.length; i++) {
    const element = allDropdown[i];
    if (!toIgnore.includes(element.id) && element.classList.contains('show')) {
      element.classList.remove('show');
    }
  }
};

export const PaletteDropdown = (category: PaletteDetails) => {
  const dropdownId: string = 'dropdown-' + category.name;
  return (
    <div className='category-dropdown'>
      <button className='dropdown-button' onClick={() => changeVisibility(dropdownId)}>
        <p className='dropdown-title ignore-pointer-events'>{category.name}</p>
        <div className='dropdown-icons ignore-pointer-events'>
          <i className={`ivy ivy-${IvyIcons.Home}`} />
          <i className={`ivy ivy-${IvyIcons.Chevron}` + ' rotate90'} />
        </div>
      </button>

      <div className='dropdown-items' id={dropdownId}>
        {category.items.map(item => (
          <PaletteItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
};
