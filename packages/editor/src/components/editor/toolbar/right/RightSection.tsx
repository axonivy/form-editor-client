import { IvyIcons } from '@axonivy/editor-icons';
import './RightSection.css';

export const RightSection = () => {
  const toggleSidebar = () => {
    document.getElementsByClassName('properties-sidebar')[0].classList.toggle('show');
  };
  return (
    <div>
      <button>
        <i className={`ivy ivy-${IvyIcons.ExitEnd}`} />
      </button>
      <button className='open-settings'>
        <i className={`ivy ivy-${IvyIcons.Settings}`} />
      </button>
      <button className='toggle-sidebar' onClick={toggleSidebar}>
        <i className={`ivy ivy-${IvyIcons.Chevron}`} />
      </button>
    </div>
  );
};
