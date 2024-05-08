import {
  Button,
  Field,
  Flex,
  IvyIcon,
  Label,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  ReadonlyProvider,
  Separator,
  Switch,
  Toolbar,
  ToolbarContainer,
  useReadonly,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../context/useData';

export const FormToolbar = () => {
  const { ui, setUi } = useAppContext();
  const { theme, setTheme } = useTheme();
  const editable = !useReadonly();
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
          {editable && (
            <Button
              icon={IvyIcons.LayoutSidebarRightCollapse}
              size='large'
              rotate={180}
              onClick={() => setUi(old => ({ ...old, components: !old.components }))}
            />
          )}
          <Button icon={IvyIcons.SelectionTool} size='large' toggle={true} />
          <Button icon={IvyIcons.EventStart} size='large' onClick={toggleResponsiveMode} />
        </Flex>
        {editable && (
          <ToolbarContainer width={450}>
            <Flex>
              <Separator orientation='vertical' style={{ height: '26px' }} />
              <Flex gap={1}>
                <Button icon={IvyIcons.Undo} size='large' />
                <Button icon={IvyIcons.Redo} size='large' />
              </Flex>
            </Flex>
          </ToolbarContainer>
        )}
      </Flex>
      <Flex gap={1}>
        <Popover>
          <PopoverTrigger asChild>
            <Button icon={IvyIcons.Settings} size='large' />
          </PopoverTrigger>
          <PopoverContent sideOffset={12}>
            <ReadonlyProvider readonly={false}>
              <Flex direction='column' gap={2}>
                {theme !== 'system' && (
                  <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                    <Label>
                      <Flex alignItems='center' gap={1}>
                        <IvyIcon icon={IvyIcons.DarkMode} />
                        Theme
                      </Flex>
                    </Label>
                    <Switch defaultChecked={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} size='small' />
                  </Field>
                )}
                {editable && (
                  <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                    <Label>
                      <Flex alignItems='center' gap={1}>
                        <IvyIcon icon={IvyIcons.Helplines} />
                        Help Paddings
                      </Flex>
                    </Label>
                    <Switch
                      defaultChecked={ui.helpPaddings}
                      onClick={() => setUi(old => ({ ...old, helpPaddings: !old.helpPaddings }))}
                      size='small'
                    />
                  </Field>
                )}
                <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                  <Label>
                    <Flex alignItems='center' gap={1}>
                      <IvyIcon icon={IvyIcons.Download} />
                      Data Source
                    </Flex>
                  </Label>
                  <Switch
                    defaultChecked={ui.dataStructure}
                    onClick={() => setUi(old => ({ ...old, dataStructure: !old.dataStructure }))}
                    size='small'
                  />
                </Field>
              </Flex>
              <PopoverArrow />
            </ReadonlyProvider>
          </PopoverContent>
        </Popover>
        <Button
          icon={IvyIcons.LayoutSidebarRightCollapse}
          size='large'
          onClick={() => setUi(old => ({ ...old, properties: !old.properties }))}
        />
      </Flex>
    </Toolbar>
  );
};
