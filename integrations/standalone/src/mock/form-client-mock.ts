import { EMPTY_FORM, type FormClient, type FormData, type FormMetaRequestTypes } from '@axonivy/form-editor-protocol';

export class FormClientMock implements FormClient {
  private formData: FormData = {
    ...EMPTY_FORM,
    components: [
      {
        id: '1',
        type: 'Input',
        config: {
          label: 'test'
        }
      },
      {
        id: '2',
        type: 'Button',
        config: {
          name: 'Proceed',
          variant: 'PRIMARY'
        }
      }
    ]
  };

  initialize(): Promise<boolean> {
    return Promise.resolve(true);
  }

  data(): Promise<FormData> {
    return Promise.resolve(this.formData);
  }

  saveData(saveData: FormData): Promise<void> {
    this.formData = saveData;
    return Promise.resolve();
  }

  meta<TMeta extends keyof FormMetaRequestTypes>(path: TMeta): Promise<FormMetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/form':
      default:
        throw Error('mock meta path not programmed');
    }
  }
}
