import type { MessageData } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';

export const useExtractFieldValidation = () => {
  const { t } = useTranslation();

  const validateComponentName = (name?: string): MessageData | undefined => {
    if (!name) {
      return { message: t('message.componentNotEmpty'), variant: 'error' };
    }
    const message = reservedCheck(name);
    if (message) {
      return message;
    }
    if (!COMPONENT_NAME_REGEX.test(name)) {
      const index = findFirstNonMatchingIndex(name, COMPONENT_NAME_REGEX);
      return { message: t('message.invalidChar', { char: name[index], pos: index + 1, str: name }), variant: 'error' };
    }
    return;
  };

  const validateComponentNamespace = (namespace?: string): MessageData | undefined => {
    if (!namespace) {
      return { message: t('message.componentNamespaceNotEmpty'), variant: 'error' };
    }
    const separator = '.';
    for (const segment of namespace.split(separator)) {
      const message = reservedCheck(segment);
      if (message) {
        return message;
      }
    }
    const nsRegex = namespaceRegex(separator);
    if (!nsRegex.test(namespace)) {
      const index = findFirstNonMatchingIndex(namespace, nsRegex);
      return { message: t('message.invalidChar', { char: namespace[index], pos: index + 1, str: namespace }), variant: 'error' };
    }
    return;
  };
  return {
    validateComponentName,
    validateComponentNamespace
  };
};

const reservedCheck = (input: string): MessageData | undefined => {
  if (JAVA_KEYWORDS.includes(input)) {
    return { message: `Input '${input}' is a reserved keyword.`, variant: 'error' };
  }
  return;
};

const findFirstNonMatchingIndex = (input: string, regex: RegExp) => {
  for (let i = 0; i < input.length; i++) {
    const subsstr = input.substring(0, i + 1);
    if (!regex.test(subsstr)) {
      return i;
    }
  }
  return -1;
};

const COMPONENT_NAME_REGEX = /^[a-zA-Z][\w_]*$/;
const namespaceRegex = (separator: string) => new RegExp(`^[a-zA-Z][\\w_]*(\\${separator}[a-zA-Z][\\w_]*)*$`);

const JAVA_KEYWORDS = [
  'abstract',
  'continue',
  'for',
  'new',
  'switch',
  'assert',
  'default',
  'goto',
  'package',
  'synchronized',
  'boolean',
  'do',
  'if',
  'private',
  'this',
  'break',
  'double',
  'implements',
  'protected',
  'throw',
  'byte',
  'else',
  'import',
  'public',
  'throws',
  'case',
  'enum',
  'instanceof',
  'return',
  'transient',
  'catch',
  'extends',
  'int',
  'short',
  'try',
  'char',
  'final',
  'interface',
  'static',
  'void',
  'class',
  'finally',
  'long',
  'strictfp',
  'volatile',
  'const',
  'float',
  'native',
  'super',
  'while'
];
