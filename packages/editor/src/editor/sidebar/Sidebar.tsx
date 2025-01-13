import { Button, Flex, Message, SidebarHeader, SidebarMessages, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useData } from '../../data/data';
import { FormOutline } from './Outline';
import { Properties } from './Properties';
import { useValidations } from '../../context/useValidation';
import { useAction } from '../../context/useAction';
import { useAppContext } from '../../context/AppContext';
import { useHotkeyTexts } from '../../utils/hotkeys';

export const Sidebar = () => {
  const { helpUrl } = useAppContext();
  const { element } = useData();
  const [outline, setOutline] = useState(false);
  const elementType = element ? (element.type ? element.type : 'DataTableColumn') : 'Properties';
  const messages = useValidations(element?.cid ?? '', { exact: true });
  const openUrl = useAction('openUrl');
  const texts = useHotkeyTexts();
  return (
    <Flex direction='column' className='properties' style={{ height: '100%' }}>
      <SidebarHeader icon={IvyIcons.PenEdit} title={elementType} className='sidebar-header'>
        <Switch
          size='large'
          icon={{ icon: IvyIcons.List }}
          checked={outline}
          onCheckedChange={setOutline}
          title='Outline'
          aria-label='Outline'
        />
        <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={texts.openHelp} title={texts.openHelp} />
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
