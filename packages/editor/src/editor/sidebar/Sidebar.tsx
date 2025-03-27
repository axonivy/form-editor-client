import { Button, Flex, Message, SidebarHeader, SidebarMessages, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useData } from '../../data/data';
import { FormOutline } from './Outline';
import { Properties } from './Properties';
import { useValidations } from '../../context/useValidation';
import { useAction } from '../../context/useAction';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/hotkeys';
import { useTranslation } from 'react-i18next';
import { useComponents } from '../../context/ComponentsContext';

export const Sidebar = () => {
  const { t } = useTranslation();
  const { helpUrl } = useAppContext();
  const { element, data } = useData();
  const { componentByName } = useComponents();
  const [outline, setOutline] = useState(false);
  const elementType = element ? (element.type ? componentByName(element.type).displayName : 'DataTableColumn') : 'Properties';

  const messages = useValidations(element?.cid ?? '', { exact: true });
  const openUrl = useAction('openUrl');
  const { openHelp: shortcut } = useKnownHotkeys();
  return (
    <Flex direction='column' className='properties' style={{ height: '100%' }}>
      <SidebarHeader icon={IvyIcons.PenEdit} title={elementType} className='sidebar-header'>
        <Switch
          size='large'
          icon={{ icon: IvyIcons.List }}
          checked={outline}
          onCheckedChange={setOutline}
          title={t('label.outline')}
          aria-label={t('label.outline')}
        />
        <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={shortcut.label} title={shortcut.label} />
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
