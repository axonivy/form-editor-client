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
import { useAppContext } from '../context/AppContext';
import { PaletteCategoryPopover, PalettePopover } from './palette/PalettePopover';
import { forwardRef, useEffect } from 'react';
import { allComponentsByCategory } from '../components/components';
import { Palette } from './palette/Palette';
import { useData } from '../data/data';
import { CompositePalette } from './palette/composite/CompositePalette';
import { useAction } from '../context/useAction';
import { DataClassDialog } from './canvas/data-class/DataClassDialog';
import { PaletteButton } from './palette/PaletteButton';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const FormToolbar = forwardRef<HTMLDivElement>((_, ref) => {
  const { ui, setUi, selectedElement, history } = useAppContext();
  const { setUnhistoricisedData } = useData();
  const { theme, setTheme } = useTheme();
  const editable = !useReadonly();
  useEffect(() => {
    if (selectedElement === undefined) {
      setUi(old => ({ ...old, properties: false }));
    }
  }, [selectedElement, setUi]);
  const changeDeviceMode = (value: DeviceMode) => setUi(old => ({ ...old, deviceMode: value }));
  const openDataClass = useAction('openDataClass');
  const openProcess = useAction('openProcess');
  return (
    <Toolbar ref={ref} className='toolbar'>
      <Flex>
        <ToggleGroup type='single' onValueChange={changeDeviceMode} defaultValue='desktop' gap={1} aria-label='Device mode'>
          <ToggleGroupItem value='mobile' aria-label='mobile' asChild>
            <Button icon={IvyIcons.DeviceMobile} size='large' />
          </ToggleGroupItem>
          <ToggleGroupItem value='tablet' aria-label='tablet' asChild>
            <Button icon={IvyIcons.DeviceTablet} size='large' />
          </ToggleGroupItem>
          <ToggleGroupItem value='desktop' aria-label='desktop' asChild>
            <Button icon={IvyIcons.EventStart} size='large' />
          </ToggleGroupItem>
        </ToggleGroup>

        {editable && (
          <ToolbarContainer maxWidth={450}>
            <Flex>
              <Separator orientation='vertical' style={{ height: '26px' }} />
              <Flex gap={1}>
                <Button
                  aria-label='Undo'
                  icon={IvyIcons.Undo}
                  size='large'
                  onClick={() => history.undo(setUnhistoricisedData)}
                  disabled={!history.canUndo}
                />
                <Button
                  aria-label='Redo'
                  icon={IvyIcons.Redo}
                  size='large'
                  onClick={() => history.redo(setUnhistoricisedData)}
                  disabled={!history.canRedo}
                />
              </Flex>
            </Flex>
          </ToolbarContainer>
        )}
      </Flex>
      {editable && (
        <Flex gap={3} className='palette-section'>
          <PalettePopover label='All Components' icon={IvyIcons.Task}>
            <Palette sections={allComponentsByCategory()} />
          </PalettePopover>
          <ToolbarContainer maxWidth={650}>
            <Flex gap={3}>
              <PaletteCategoryPopover label='Structure' icon={IvyIcons.LaneSwimlanes} />
              <PaletteCategoryPopover label='Elements' icon={IvyIcons.ChangeType} />
              <PaletteCategoryPopover label='Action' icon={IvyIcons.MultiSelection} />
            </Flex>
          </ToolbarContainer>
          <PalettePopover label='Composite' icon={IvyIcons.File}>
            <CompositePalette />
          </PalettePopover>
          <PaletteButton text='Data'>
            <DataClassDialog worfkflowButtonsInit={false}>
              <Button icon={IvyIcons.DatabaseLink} size='large' aria-label='Create from data' />
            </DataClassDialog>
          </PaletteButton>
        </Flex>
      )}

      <Flex gap={1} alignItems='center'>
        {editable && (
          <Switch
            icon={{ icon: IvyIcons.Eye }}
            defaultChecked={ui.helpPaddings}
            onClick={() => setUi(old => ({ ...old, helpPaddings: !old.helpPaddings }))}
            size='large'
            aria-label='Help Paddings'
          />
        )}
        <Button aria-label='Open Data Class' icon={IvyIcons.DatabaseLink} size='large' onClick={() => openDataClass()} />
        <Button aria-label='Open Process' icon={IvyIcons.Process} size='large' onClick={() => openProcess()} />
        <Popover>
          <PopoverTrigger asChild>
            <Button aria-label='Options' icon={IvyIcons.Settings} size='large' />
          </PopoverTrigger>
          <PopoverContent sideOffset={12} collisionPadding={5}>
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
          aria-label='Toggle Property View'
          size='large'
          onClick={() => setUi(old => ({ ...old, properties: !old.properties }))}
        />
      </Flex>
    </Toolbar>
  );
});
