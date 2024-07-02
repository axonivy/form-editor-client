import type { IvyIcons } from '@axonivy/ui-icons';
import type { ComponentConfig } from '../../../types/config';
import { Button, Fieldset, Flex, Popover, PopoverArrow, PopoverContent, PopoverTrigger, ReadonlyProvider } from '@axonivy/ui-components';
import { Palette } from './Palette';

type CategoryPopoverProps = {
  label: string;
  icon: IvyIcons;
  items: Record<string, ComponentConfig[]>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const PaletteCategoryPopover = ({ label, icon, items, open, onOpenChange }: CategoryPopoverProps) => (
  <Flex direction='column' alignItems={'center'} className='category-popover'>
    <Fieldset label={label} />
    <Popover onOpenChange={onOpenChange} open={open}>
      <PopoverTrigger asChild>
        <Button icon={icon} size='large' />
      </PopoverTrigger>
      <PopoverContent sideOffset={12}>
        <ReadonlyProvider readonly={false}>
          <Palette items={items} />
          <PopoverArrow />
        </ReadonlyProvider>
      </PopoverContent>
    </Popover>
  </Flex>
);
