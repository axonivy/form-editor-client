import {
  EMPTY_FORM,
  type Event,
  type FormClient,
  type FormEditorData,
  type FormMetaRequestTypes,
  type FormSaveDataArgs
} from '@axonivy/form-editor-protocol';

export class FormClientMock implements FormClient {
  private formData: FormEditorData = {
    context: { app: 'mock', pmv: 'mock', file: 'mock.f.json' },
    readonly: false,
    defaults: {},
    data: {
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
        },
        {
          id: '3',
          type: 'Layout',
          config: {
            components: [
              { id: '31', type: 'Text', config: { content: 'bla' } },
              { id: '32', type: 'Button', config: { name: 'hi', variant: 'SECONDARY' } }
            ]
          }
        }
      ]
    }
  };

  data(): Promise<FormEditorData> {
    return Promise.resolve(this.formData);
  }

  saveData(saveData: FormSaveDataArgs): Promise<void> {
    this.formData.data = saveData.data;
    return Promise.resolve();
  }

  meta<TMeta extends keyof FormMetaRequestTypes>(path: TMeta): Promise<FormMetaRequestTypes[TMeta][1]> {
    switch (path) {
      case 'meta/data/attributes':
      default:
        throw Error('mock meta path not programmed');
    }
  }

  onDataChanged: Event<void>;
}
