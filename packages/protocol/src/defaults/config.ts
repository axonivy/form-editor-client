import type { FormData } from '../data/form-data';

export const EMPTY_FORM: FormData = {
  id: 'empty',
  config: {
    renderer: 'JSF',
    theme: '',
    type: 'FORM'
  },
  components: []
} as const;
