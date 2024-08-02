import type { Variable, VariableInfo } from '@axonivy/form-editor-protocol';
import type { PaletteConfig } from '../PaletteItem';
import { componentsByType } from '../../../components';
import { labelText } from '../../../../utils/string';

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
    ?.map(variable => {
      const components = componentsByType(variable.type);
      const paletteConfigs = components.map<PaletteConfig>(component => ({
        ...component,
        name: variable.attribute,
        description: variable.description,
        data: { componentName: component.name, label: labelText(variable.attribute), value: `${parent.attribute}.${variable.attribute}` }
      }));
      return paletteConfigs[0];
    })
    .filter(Boolean);
