import type { FormData } from '../data';

export const EMPTY_FORM: FormData = {
  id: 'empty',
  config: {
    renderer: 'JSF',
    theme: ''
  },
  components: []
} as const;
