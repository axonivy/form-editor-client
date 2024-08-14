import { IvyIcons } from '@axonivy/ui-icons';
import type { ItemCategory } from '../../types/config';
import { Button, Flex, IvyIcon, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@axonivy/ui-components';
import { Palette } from './Palette';
import { componentsByCategory } from '../../components/components';
import { useDndContext } from '@dnd-kit/core';
import { useEffect, useState, type ReactNode } from 'react';
import './PalettePopover.css';

type PalettePopoverProps = {
  label: string;
  icon: IvyIcons;
  children: ReactNode;
};

export const PalettePopover = ({ label, icon, children }: PalettePopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { active } = useDndContext();

  useEffect(() => {
    if (active !== undefined) {
      setPopoverOpen(false);
    }
  }, [active]);

  return (
    <Flex direction='column' alignItems={'center'} gap={1} className='category-popover'>
      <span className='category-label'>{label}</span>
      <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
        <PopoverTrigger asChild>
          <Button icon={icon} size='large'>
            <IvyIcon icon={IvyIcons.Chevron} className='category-icon' rotate={popoverOpen ? 270 : 90} />
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={5} hideWhenDetached={true}>
          {children}
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    </Flex>
  );
};

export const PaletteCategoryPopover = (props: Omit<PalettePopoverProps, 'children'> & { label: ItemCategory }) => (
  <PalettePopover {...props}>
    <Palette sections={componentsByCategory(props.label)} />
  </PalettePopover>
);
