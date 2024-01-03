import type { ComponentConfig } from '../../components/component';

export type PaletteConfig = Omit<ComponentConfig, 'render' | 'defaultProps' | 'fields'>;
