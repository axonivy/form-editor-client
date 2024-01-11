import { IvyIcons } from '@axonivy/editor-icons';
import './LeftSection.css';

export const LeftSection = () => {
  return (
    <div className='left-section'>
      <button className='undo'>
        <i className={`ivy ivy-${IvyIcons.Undo}`} />
      </button>
      <button className='redo'>
        <i className={`ivy ivy-${IvyIcons.Redo}`} />
      </button>
    </div>
  );
};
