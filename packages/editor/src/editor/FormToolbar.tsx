import {
  Button,
  Field,
  Flex,
  hotkeyText,
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
import { useAppContext } from '../context/AppContext';
import { PaletteCategoryPopover, PalettePopover } from './palette/PalettePopover';
import { forwardRef, useEffect, useMemo } from 'react';
import { allComponentsByCategory } from '../components/components';
import { Palette } from './palette/Palette';
import { useData } from '../data/data';
import { CompositePalette } from './palette/composite/CompositePalette';
import { useAction } from '../context/useAction';
import { CREATE_FROM_DATA_HOTKEY, DataClassDialog } from './browser/data-class/DataClassDialog';
import { PaletteButton } from './palette/PaletteButton';
import { useHotkeys } from 'react-hotkeys-hook';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const UNDO_HOTKEY = 'mod+Z';
const REDO_HOTKEY = 'mod+shift+Z';

const OPEN_DATACLASS_HOTKEY = 'D';
const OPEN_PROCESS_HOTKEY = 'P';
const OPEN_HELP_HOTKEY = 'F1';

const VIEW_MODE_HOTKEY = 'E';
const DEVICE_MODE_HOTKEY = 'S';

export const useHotkeyTexts = () => {
  const undo = useMemo(() => `Undo (${hotkeyText(UNDO_HOTKEY)})`, []);
  const redo = useMemo(() => `Redo (${hotkeyText(REDO_HOTKEY)})`, []);
  const openDataClass = useMemo(() => `Open Data Class (${hotkeyText(OPEN_DATACLASS_HOTKEY)})`, []);
  const openProcess = useMemo(() => `Open Process (${hotkeyText(OPEN_PROCESS_HOTKEY)})`, []);
  const openHelp = useMemo(() => `Open Help (${hotkeyText(OPEN_HELP_HOTKEY)})`, []);
  const viewMode = useMemo(() => `View Mode (${hotkeyText(VIEW_MODE_HOTKEY)})`, []);
  const createFromData = useMemo(() => `Create from data (${hotkeyText(CREATE_FROM_DATA_HOTKEY)})`, []);
  return { undo, redo, openDataClass, openProcess, openHelp, viewMode, createFromData };
};

export const FormToolbar = forwardRef<HTMLDivElement>((_, ref) => {
  const { ui, setUi, selectedElement, history, helpUrl } = useAppContext();
  const { setUnhistoricisedData } = useData();
  const { theme, setTheme, disabled } = useTheme();
  const editable = !useReadonly();
  useEffect(() => {
    if (selectedElement === undefined) {
      setUi(old => ({ ...old, properties: false }));
    }
  }, [selectedElement, setUi]);
  const openDataClass = useAction('openDataClass');
  const openProcess = useAction('openProcess');
  const openUrl = useAction('openUrl');
  const undo = () => history.undo(setUnhistoricisedData);
  const redo = () => history.redo(setUnhistoricisedData);
  const changeViewMode = () => setUi(old => ({ ...old, helpPaddings: !old.helpPaddings }));
  useHotkeys(UNDO_HOTKEY, undo, { scopes: ['global'] });
  useHotkeys(REDO_HOTKEY, redo, { scopes: ['global'] });

  useHotkeys(OPEN_DATACLASS_HOTKEY, () => openDataClass(), { scopes: ['global'] });
  useHotkeys(OPEN_PROCESS_HOTKEY, () => openProcess(), { scopes: ['global'] });
  useHotkeys(OPEN_HELP_HOTKEY, () => openUrl(helpUrl), { scopes: ['global'] });

  useHotkeys(VIEW_MODE_HOTKEY, changeViewMode, { scopes: ['global'] });
  const texts = useHotkeyTexts();

  const deviceModeProps = useMemo(() => {
    const changeDeviceMode = (value: DeviceMode) => setUi(old => ({ ...old, deviceMode: value }));
    const title = `Device mode ${ui.deviceMode} (${hotkeyText(DEVICE_MODE_HOTKEY)})`;
    const icon =
      ui.deviceMode === 'mobile' ? IvyIcons.DeviceMobile : ui.deviceMode === 'tablet' ? IvyIcons.DeviceTablet : IvyIcons.EventStart;
    const nextDevice = ui.deviceMode === 'mobile' ? 'desktop' : ui.deviceMode === 'desktop' ? 'tablet' : 'mobile';
    return { icon, title, 'aria-label': title, size: 'large', onClick: () => changeDeviceMode(nextDevice) } as const;
  }, [setUi, ui.deviceMode]);
  useHotkeys(DEVICE_MODE_HOTKEY, deviceModeProps.onClick, { scopes: ['global'] });

  return (
    <Toolbar ref={ref} className='toolbar'>
      <Flex gap={1}>
        <Button {...deviceModeProps} />
        {editable && (
          <>
            <Button
              icon={ui.helpPaddings ? IvyIcons.Edit : IvyIcons.Eye}
              onClick={changeViewMode}
              size='large'
              aria-label={texts.viewMode}
              title={texts.viewMode}
            />
            <ToolbarContainer maxWidth={450}>
              <Flex>
                <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
                <Flex gap={1}>
                  <Button
                    title={texts.undo}
                    aria-label={texts.undo}
                    icon={IvyIcons.Undo}
                    size='large'
                    onClick={undo}
                    disabled={!history.canUndo}
                  />
                  <Button
                    title={texts.redo}
                    aria-label={texts.redo}
                    icon={IvyIcons.Redo}
                    size='large'
                    onClick={redo}
                    disabled={!history.canRedo}
                  />
                </Flex>
              </Flex>
            </ToolbarContainer>
          </>
        )}
      </Flex>
      {editable && (
        <Flex gap={3} className='palette-section'>
          <PalettePopover label='All Components' icon={IvyIcons.Task}>
            <Palette sections={allComponentsByCategory()} />
          </PalettePopover>
          <ToolbarContainer maxWidth={650}>
            <Flex gap={3}>
              <PaletteCategoryPopover label='Structures' icon={IvyIcons.LaneSwimlanes} />
              <PaletteCategoryPopover label='Elements' icon={IvyIcons.ChangeType} />
              <PaletteCategoryPopover label='Actions' icon={IvyIcons.MultiSelection} />
            </Flex>
          </ToolbarContainer>
          <PalettePopover label='Composites' icon={IvyIcons.File}>
            <CompositePalette />
          </PalettePopover>
          <PaletteButton text='Data'>
            <DataClassDialog worfkflowButtonsInit={false}>
              <Button icon={IvyIcons.DatabaseLink} size='large' aria-label={texts.createFromData} title={texts.createFromData} />
            </DataClassDialog>
          </PaletteButton>
        </Flex>
      )}

      <Flex gap={1} alignItems='center'>
        <Button
          title={texts.openDataClass}
          aria-label={texts.openDataClass}
          icon={IvyIcons.DatabaseLink}
          size='large'
          onClick={() => openDataClass()}
        />
        <Button
          title={texts.openProcess}
          aria-label={texts.openProcess}
          icon={IvyIcons.Process}
          size='large'
          onClick={() => openProcess()}
        />
        {!disabled && (
          <Popover>
            <PopoverTrigger asChild>
              <Button title='Options' aria-label='Options' icon={IvyIcons.Settings} size='large' />
            </PopoverTrigger>
            <PopoverContent sideOffset={12} collisionPadding={5}>
              <ReadonlyProvider readonly={false}>
                <Flex direction='column' gap={2}>
                  <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                    <Label>
                      <Flex alignItems='center' gap={1}>
                        <IvyIcon icon={IvyIcons.DarkMode} />
                        Theme
                      </Flex>
                    </Label>
                    <Switch defaultChecked={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} size='small' />
                  </Field>
                </Flex>
                <PopoverArrow />
              </ReadonlyProvider>
            </PopoverContent>
          </Popover>
        )}
        <Button
          icon={IvyIcons.LayoutSidebarRightCollapse}
          title='Toggle Property View'
          aria-label='Toggle Property View'
          size='large'
          onClick={() => setUi(old => ({ ...old, properties: !old.properties }))}
        />
      </Flex>
    </Toolbar>
  );
});
