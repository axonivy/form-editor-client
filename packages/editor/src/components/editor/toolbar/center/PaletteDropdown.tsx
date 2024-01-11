import './PaletteDropdown.css';
import type { PaletteDetails } from './Palette';
import { PaletteItem } from './PaletteItem';
import { IvyIcons } from '@axonivy/editor-icons';

// TODO: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_dropdown

const changeVisibility = (id: string, btnId: string) => {
  hideAll([id]);
  document.getElementById(id)?.classList.toggle('show');
  (document.querySelector(':root') as HTMLElement).style.setProperty('--arrow-pos', getArrowPos(id, btnId) + 'px');
};

const getArrowPos = (id: string, btnId: string) => {
  const dropdown: DOMRect = (document.getElementById(id) as Element).getBoundingClientRect();
  const dropdownBtn: DOMRect = (document.getElementById(btnId) as Element).getBoundingClientRect();
  const diff = Math.abs(dropdown.x - dropdownBtn.x + dropdown.width / 2);
  console.log(dropdown);
  console.log(diff);
  return diff;
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
  const btnId: string = 'dropdown-button-' + category.name;
  return (
    <div className='category-dropdown'>
      <button className='dropdown-button' id={btnId} onClick={() => changeVisibility(dropdownId, btnId)}>
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
