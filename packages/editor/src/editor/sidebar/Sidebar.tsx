import { Button, Flex, Message, SidebarHeader, SidebarMessages, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useData } from '../../data/data';
import { FormOutline } from './Outline';
import { Properties } from './Properties';
import { useValidations } from '../../context/useValidation';
import { useAction } from '../../context/useAction';
import { useAppContext } from '../../context/AppContext';
import { OPEN_HELP_TEXT } from '../FormToolbar';

export const Sidebar = () => {
  const { helpUrl } = useAppContext();
  const { element } = useData();
  const [outline, setOutline] = useState(false);
  const elementType = element ? (element.type ? element.type : 'DataTableColumn') : 'Properties';
  const messages = useValidations(element?.cid ?? '', { exact: true });
  const openUrl = useAction('openUrl');
  return (
    <Flex direction='column' className='properties' style={{ height: '100%' }}>
      <SidebarHeader icon={IvyIcons.PenEdit} title={elementType} className='sidebar-header'>
        <Switch size='large' icon={{ icon: IvyIcons.List }} checked={outline} onCheckedChange={setOutline} />
        <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={OPEN_HELP_TEXT} title={OPEN_HELP_TEXT} />
      </SidebarHeader>
      {messages.length > 0 && (
        <SidebarMessages>
          {messages.map((msg, i) => (
            <Message key={i} {...msg} />
          ))}
        </SidebarMessages>
      )}
      {outline ? <FormOutline hideOutline={() => setOutline(false)} /> : <Properties />}
    </Flex>
  );
};
