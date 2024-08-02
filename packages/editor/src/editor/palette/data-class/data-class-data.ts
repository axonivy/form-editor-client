import type { Variable, VariableInfo } from '@axonivy/form-editor-protocol';
import type { PaletteConfig } from '../PaletteItem';
import { labelText } from '../../../utils/string';
import { config } from '../../../components/components';

export const paletteItems = (dataClass: VariableInfo): Record<string, Array<PaletteConfig>> => {
  const paletteItems: Record<string, Array<PaletteConfig>> = {};
  if (dataClass === undefined || dataClass.variables.length === 0) {
    return paletteItems;
  }
  dataClass.variables.forEach(variable => {
    paletteItems[variable.attribute] = toPaletteConfigs(dataClass, variable);
    for (const type of dataClass.types[variable.type]) {
      if (dataClass.types[type.type] !== undefined) {
        const attribute = `${variable.attribute}.${type.attribute}`;
        paletteItems[attribute] = toPaletteConfigs(dataClass, { ...type, attribute });
      }
    }
  });
  return paletteItems;
};

const toPaletteConfigs = (dataClass: VariableInfo, parent: Variable): Array<PaletteConfig> =>
  dataClass.types[parent.type]
    ?.filter(variable => blockForType(variable.type) !== undefined)
    .map(variable => {
      const block = blockForType(variable.type)!;
      return {
        ...block.component,
        name: variable.attribute,
        description: variable.description,
        data: {
          componentName: block.component.name,
          label: labelText(variable.attribute),
          value: `#{${parent.attribute}.${variable.attribute}}`,
          ...block.defaultProps
        }
      };
    })
    .filter(Boolean);

const blockForType = (type: 'String' | 'Number' | 'Boolean' | 'Date' | 'DateTime' | 'Time' | 'File' | string) => {
  switch (type) {
    case 'String':
      return { component: config.components.Input };
    case 'Number':
      return { component: config.components.Input, defaultProps: { type: 'NUMBER' } };
    case 'Boolean':
    case 'Date':
    case 'DateTime':
    case 'Time':
    case 'File':
    default:
      return undefined;
  }
};
