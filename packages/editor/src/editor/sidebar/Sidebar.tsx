import { Flex, Message, SidebarHeader, SidebarMessages, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useData } from '../../data/data';
import { FormOutline } from './Outline';
import { Properties } from './Properties';
import { useValidations } from '../../context/useValidation';

export const Sidebar = () => {
  const { element } = useData();
  const [outline, setOutline] = useState(false);
  const elementType = element ? (element.type ? element.type : 'DataTableColumn') : 'Properties';
  const messages = useValidations(element?.cid ?? '', { exact: true });

  return (
    <Flex direction='column' className='properties' style={{ height: '100%' }}>
      <SidebarHeader icon={IvyIcons.PenEdit} title={elementType} className='sidebar-header'>
        <Switch size='large' icon={{ icon: IvyIcons.List }} checked={outline} onCheckedChange={setOutline} />
      </SidebarHeader>
      <SidebarMessages>
        {messages.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}
      </SidebarMessages>
      {outline ? <FormOutline hideOutline={() => setOutline(false)} /> : <Properties />}
    </Flex>
  );
};
