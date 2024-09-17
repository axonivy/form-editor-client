import type { CompositeInfo } from '@axonivy/form-editor-protocol';
import type { PaletteConfig } from '../PaletteItem';
import { simpleType } from '../../../utils/string';
import { splitByCamelCase } from '@axonivy/ui-components';

export const paletteItems = (composites: Array<CompositeInfo>): Record<string, Array<PaletteConfig>> => {
  const paletteItems: Record<string, Array<PaletteConfig>> = {};
  paletteItems['All'] = composites.map<PaletteConfig>(composite => ({
    name: splitByCamelCase(simpleType(composite.id)),
    description: composite.id,
    data: { componentName: 'Composite', label: composite.id, value: composite.id }
  }));
  return paletteItems;
};
