import type { Variable, VariableInfo } from '@axonivy/form-editor-protocol';
import type { PaletteConfig } from '../PaletteItem';
import { labelText } from '../../../utils/string';
import { componentForType } from '../../../components/components';

export const paletteItems = (dataClass: VariableInfo, maxDepth: number = 4): Record<string, Array<PaletteConfig>> => {
  const paletteItems: Record<string, Array<PaletteConfig>> = {};
  if (dataClass === undefined || dataClass.variables.length === 0) {
    return paletteItems;
  }

  const processVariable = (parentAttribute: string, variable: Variable, currentDepth: number) => {
    if (currentDepth > maxDepth) {
      return;
    }

    const configs = toPaletteConfigs(dataClass, { ...variable, attribute: parentAttribute });
    paletteItems[parentAttribute] = configs;

    if (dataClass.types[variable.type]) {
      dataClass.types[variable.type].forEach(subVariable => {
        const subAttribute = `${parentAttribute}.${subVariable.attribute}`;
        processVariable(subAttribute, subVariable, currentDepth + 1);
      });
    }
  };

  dataClass.variables.forEach(variable => {
    processVariable(variable.attribute, variable, 1);
  });

  return paletteItems;
};

const toPaletteConfigs = (dataClass: VariableInfo, parent: Variable): Array<PaletteConfig> => {
  const types = dataClass.types[parent.type];
  if (!types) {
    return [];
  }
  return types
    .filter(variable => componentForType(variable.type) !== undefined)
    .map(variable => {
      const block = componentForType(variable.type)!;
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
};
