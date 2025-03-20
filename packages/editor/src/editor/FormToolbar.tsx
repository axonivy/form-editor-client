import {
  Button,
  Field,
  Flex,
  hotkeyRedoFix,
  hotkeyText,
  hotkeyUndoFix,
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
  useHotkeys,
  useReadonly,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../context/AppContext';
import { PaletteCategoryPopover, PalettePopover } from './palette/PalettePopover';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import { allComponentsByCategory } from '../components/components';
import { Palette } from './palette/Palette';
import { useData } from '../data/data';
import { CompositePalette } from './palette/composite/CompositePalette';
import { useAction } from '../context/useAction';
import { DataClassDialog } from './browser/data-class/DataClassDialog';
import { PaletteButton } from './palette/PaletteButton';
import { useKnownHotkeys } from '../utils/hotkeys';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

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
  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.undo.hotkey, e => hotkeyUndoFix(e, undo), { scopes: ['global'] });
  useHotkeys(hotkeys.redo.hotkey, e => hotkeyRedoFix(e, redo), { scopes: ['global'] });

  useHotkeys(hotkeys.openDataClass.hotkey, () => openDataClass(), { scopes: ['global'] });
  useHotkeys(hotkeys.openProcess.hotkey, () => openProcess(), { scopes: ['global'] });
  useHotkeys(hotkeys.openHelp.hotkey, () => openUrl(helpUrl), { scopes: ['global'] });

  useHotkeys(hotkeys.viewMode.hotkey, changeViewMode, { scopes: ['global'], enabled: editable });

  const deviceModeProps = useMemo(() => {
    const changeDeviceMode = (value: DeviceMode) => setUi(old => ({ ...old, deviceMode: value }));
    const title = `Device mode ${ui.deviceMode} (${hotkeyText(hotkeys.deviceMode.hotkey)})`;
    const icon =
      ui.deviceMode === 'mobile' ? IvyIcons.DeviceMobile : ui.deviceMode === 'tablet' ? IvyIcons.DeviceTablet : IvyIcons.EventStart;
    const nextDevice = ui.deviceMode === 'mobile' ? 'desktop' : ui.deviceMode === 'desktop' ? 'tablet' : 'mobile';
    return { icon, title, 'aria-label': title, size: 'large', onClick: () => changeDeviceMode(nextDevice) } as const;
  }, [hotkeys.deviceMode.hotkey, setUi, ui.deviceMode]);
  useHotkeys(hotkeys.deviceMode.hotkey, deviceModeProps.onClick, { scopes: ['global'] });

  const firstElement = useRef<HTMLButtonElement>(null);
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(hotkeys.focusMain.hotkey, () => document.querySelector<HTMLElement>('.draggable')?.focus(), { scopes: ['global'] });
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setUi(old => ({ ...old, properties: true }));
      document.querySelector<HTMLElement>('.ui-accordion-trigger')?.focus();
    },
    {
      scopes: ['global']
    }
  );

  return (
    <Toolbar ref={ref} className='toolbar'>
      <Flex gap={1}>
        <Button ref={firstElement} {...deviceModeProps} />
        {editable && (
          <>
            <Button
              icon={ui.helpPaddings ? IvyIcons.Edit : IvyIcons.Eye}
              onClick={changeViewMode}
              size='large'
              aria-label={hotkeys.viewMode.label}
              title={hotkeys.viewMode.label}
            />
            <ToolbarContainer maxWidth={450}>
              <Flex>
                <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
                <Flex gap={1}>
                  <Button
                    title={hotkeys.undo.label}
                    aria-label={hotkeys.undo.label}
                    icon={IvyIcons.Undo}
                    size='large'
                    onClick={undo}
                    disabled={!history.canUndo}
                  />
                  <Button
                    title={hotkeys.redo.label}
                    aria-label={hotkeys.redo.label}
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
            <DataClassDialog workflowButtonsInit={false}>
              <Button
                icon={IvyIcons.DatabaseLink}
                size='large'
                aria-label={hotkeys.createFromData.label}
                title={hotkeys.createFromData.label}
              />
            </DataClassDialog>
          </PaletteButton>
        </Flex>
      )}

      <Flex gap={1} alignItems='center'>
        <Button
          title={hotkeys.openDataClass.label}
          aria-label={hotkeys.openDataClass.label}
          icon={IvyIcons.DatabaseLink}
          size='large'
          onClick={() => openDataClass()}
        />
        <Button
          title={hotkeys.openProcess.label}
          aria-label={hotkeys.openProcess.label}
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
