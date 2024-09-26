import { Flex } from '@axonivy/ui-components';
import type { ReactNode } from 'react';
import './PaletteButton.css';

export const PaletteButton = ({ text, children }: { text: string; children: ReactNode }) => (
  <Flex direction='column' alignItems='center' gap={1} className='palette-button'>
    <span className='category-label'>{text}</span>
    {children}
  </Flex>
);
