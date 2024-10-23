import type { ComponentData, FormData, ValidationResult } from '@axonivy/form-editor-protocol';

export const validateMock = (data: FormData): Array<ValidationResult> => {
  const validations: Array<ValidationResult> = [];
  validateDeep(data.components, validations);
  return validations;
};

const validateDeep = (components: Array<ComponentData>, validations: Array<ValidationResult>) => {
  components.forEach(c => {
    if ('components' in c.config) {
      validateDeep(c.config.components as Array<ComponentData>, validations);
    }
    if (c.type === 'Input') {
      if (c.config.value === undefined || (c.config.value as string).length === 0) {
        validations.push({ path: `${c.cid}.value`, message: 'Value is required', severity: 'ERROR' });
      }
    }
    if (c.type === 'Select') {
      if (c.config.value === undefined || (c.config.value as string).length === 0) {
        validations.push({ path: `${c.cid}.value`, message: 'Value is required', severity: 'WARNING' });
      }
    }
  });
};
