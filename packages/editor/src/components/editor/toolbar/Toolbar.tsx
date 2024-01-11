import { componentsGroupByCategroy } from '../../components';
import { Palette } from "./center/Palette"
import { RightSection } from "./right/RightSection"
import { IvyIcons } from '@axonivy/editor-icons';

export const Toolbar = () => {


    return (
        <div className='palette-header-wrapper'>
        <div className='undo'>
          <i className={`ivy ivy-${IvyIcons.Undo}`} />
          <i className={`ivy ivy-${IvyIcons.Redo}`} />
        </div>
        <Palette items={componentsGroupByCategroy()} />
        <RightSection />
      </div>
    )
}