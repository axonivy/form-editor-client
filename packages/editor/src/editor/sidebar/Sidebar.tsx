import { Flex, SidebarHeader, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useData } from '../../data/data';
import { FormOutline } from './Outline';
import { Properties } from './Properties';

export const Sidebar = () => {
  const { element } = useData();
  const [outline, setOutline] = useState(false);
  return (
    <Flex direction='column' className='properties' style={{ height: '100%' }}>
      <SidebarHeader icon={IvyIcons.PenEdit} title={element?.type ?? 'Properties'} className='sidebar-header'>
        <Switch size='large' icon={{ icon: IvyIcons.List }} checked={outline} onCheckedChange={setOutline} />
      </SidebarHeader>
      {outline ? <FormOutline hideOutline={() => setOutline(false)} /> : <Properties />}
    </Flex>
  );
};
