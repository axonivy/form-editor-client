import { Button, Flex, Separator, Toolbar, ToolbarContainer, useTheme } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../context/useData';

export const FormToolbar = () => {
  const { ui, setUi } = useAppContext();
  const { theme, setTheme } = useTheme();
  const toggleResponsiveMode = () =>
    setUi(old => {
      const prev = old.responsiveMode;
      let next = prev;
      switch (prev) {
        case 'desktop':
          next = 'tablet';
          break;
        case 'tablet':
          next = 'mobile';
          break;
        case 'mobile':
          next = 'desktop';
          break;
      }
      return { ...old, responsiveMode: next };
    });
  return (
    <Toolbar>
      <Flex>
        <Flex gap={1}>
          <Button
            icon={IvyIcons.LayoutSidebarRightCollapse}
            size='large'
            rotate='180'
            onClick={() => setUi(old => ({ ...old, components: !old.components }))}
          />
          <Button icon={IvyIcons.SelectionTool} size='large' toggle={true} />
          <Button icon={IvyIcons.EventStart} size='large' onClick={toggleResponsiveMode} />
        </Flex>
        <ToolbarContainer width={450}>
          <Flex>
            <Separator orientation='vertical' style={{ height: '26px' }} />
            <Flex gap={1}>
              <Button icon={IvyIcons.Undo} size='large' />
              <Button icon={IvyIcons.Redo} size='large' />
            </Flex>
          </Flex>
        </ToolbarContainer>
      </Flex>
      <Flex gap={1}>
        <Button
          icon={IvyIcons.Download}
          size='large'
          onClick={() => setUi(old => ({ ...old, dataStructure: !old.dataStructure }))}
          toggle={ui.dataStructure}
        />
        <Button
          icon={IvyIcons.Helplines}
          size='large'
          onClick={() => setUi(old => ({ ...old, helpPaddings: !old.helpPaddings }))}
          toggle={ui.helpPaddings}
        />
        {theme !== 'system' && (
          <Button
            icon={IvyIcons.DarkMode}
            size='large'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            toggle={theme === 'dark'}
          />
        )}
        <Button
          icon={IvyIcons.LayoutSidebarRightCollapse}
          size='large'
          onClick={() => setUi(old => ({ ...old, properties: !old.properties }))}
        />
      </Flex>
    </Toolbar>
  );
};
