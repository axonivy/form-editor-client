import { componentsGroupByCategroy } from '../../components';
import { Palette } from './center/Palette';
import { RightSection } from './right/RightSection';
import { IvyIcons } from '@axonivy/editor-icons';
import './Toolbar.css';
import { LeftSection } from './left/LeftSection';

export const Toolbar = () => {
  return (
    <div className='toolbar'>
      <LeftSection />
      <Palette items={componentsGroupByCategroy()} />
      <RightSection />
    </div>
  );
};
