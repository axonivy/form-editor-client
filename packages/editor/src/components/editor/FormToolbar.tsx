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
  ToggleGroup,
  ToggleGroupItem,
  ToolbarContainer,
  useReadonly,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../context/useData';
import { PaletteCategoryPopover } from './palette/PaletteCategoryPopup';
import { forwardRef, useEffect } from 'react';

type ResponsiveMode = 'desktop' | 'tablet' | 'mobile';

export const FormToolbar = forwardRef<HTMLDivElement>((_, ref) => {
  const { ui, setUi, selectedElement } = useAppContext();
  const { theme, setTheme } = useTheme();
  const editable = !useReadonly();

  useEffect(() => {
    setUi(old => ({ ...old, properties: selectedElement === undefined ? false : true }));
  }, [selectedElement, setUi]);

  const changeResponsiveMode = (value: ResponsiveMode) => {
    if (value) {
      setUi(old => {
        return { ...old, responsiveMode: value };
      });
    }
  };

  return (
    <Toolbar ref={ref}>
      <Flex>
        <ToggleGroup type='single' onValueChange={changeResponsiveMode} defaultValue='desktop' gap={1} aria-label='Class selection'>
          <ToggleGroupItem value='mobile' asChild>
            <Button icon={IvyIcons.DeviceMobile} size='large' />
          </ToggleGroupItem>
          <ToggleGroupItem value='tablet' asChild>
            <Button icon={IvyIcons.DeviceTablet} size='large' />
          </ToggleGroupItem>
          <ToggleGroupItem value='desktop' asChild>
            <Button icon={IvyIcons.EventStart} size='large' />
          </ToggleGroupItem>
        </ToggleGroup>

        {editable && (
          <ToolbarContainer maxWidth={450}>
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
      <Flex gap={3} className='palette-section'>
        <PaletteCategoryPopover label='All Components' icon={IvyIcons.Task} />
        <ToolbarContainer maxWidth={650}>
          <Flex gap={3}>
            <PaletteCategoryPopover label='Structure' icon={IvyIcons.LaneSwimlanes} />
            <PaletteCategoryPopover label='Elements' icon={IvyIcons.ChangeType} />
            <PaletteCategoryPopover label='Action' icon={IvyIcons.MultiSelection} />
          </Flex>
        </ToolbarContainer>
      </Flex>

      <Flex gap={1} alignItems='center'>
        {editable && (
          <Switch
            icon={{ icon: IvyIcons.Eye }}
            defaultChecked={ui.helpPaddings}
            onClick={() => setUi(old => ({ ...old, helpPaddings: !old.helpPaddings }))}
            size='large'
          />
        )}
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
});
