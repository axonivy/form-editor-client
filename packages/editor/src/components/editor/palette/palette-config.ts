import type { ComponentConfig } from '../../../types/config';

export type PaletteConfig = Omit<ComponentConfig, 'render' | 'defaultProps' | 'fields'>;
