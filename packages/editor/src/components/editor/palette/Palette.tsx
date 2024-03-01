import { PaletteItem } from './PaletteItem';
import type { PaletteConfig } from './palette-config';
import './Palette.css';
import { IvyIcons } from '@axonivy/ui-icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Flex, SidebarHeader } from '@axonivy/ui-components';

type PaletteProps = {
  items: Record<string, PaletteConfig[]>;
};

export const Palette = ({ items }: PaletteProps) => {
  return (
    <Flex direction='column' className='palette'>
      <SidebarHeader icon={IvyIcons.LaneSwimlanes} title='Components' />
      <Accordion type='single' collapsible defaultValue={Object.keys(items)[0]}>
        {Object.entries(items).map(([category, groupItems]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <div className='palette-category-items'>
                {groupItems.map(item => (
                  <PaletteItem key={item.name} item={item} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};
