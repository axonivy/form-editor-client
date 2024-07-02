import type { IvyIcons } from '@axonivy/ui-icons';
import type { itemCategory } from '../../../types/config';
import { Button, Fieldset, Flex, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@axonivy/ui-components';
import { Palette } from './Palette';
import { componentsByCategory } from '../../components';
import { useDndContext } from '@dnd-kit/core';
import { useEffect, useState } from 'react';

type CategoryPopoverProps = {
  label: itemCategory;
  icon: IvyIcons;
};

export const PaletteCategoryPopover = ({ label, icon }: CategoryPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { active } = useDndContext();

  useEffect(() => {
    if (active !== undefined) {
      setPopoverOpen(false);
    }
  }, [active]);

  return (
    <Flex direction='column' alignItems={'center'} className='category-popover'>
      <Fieldset label={label} />
      <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
        <PopoverTrigger asChild>
          <Button icon={icon} size='large' />
        </PopoverTrigger>
        <PopoverContent sideOffset={12}>
          <Palette items={componentsByCategory(label)} />
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
