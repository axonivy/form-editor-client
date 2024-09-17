import type { VariableInfo } from '@axonivy/form-editor-protocol';

export namespace MetaMock {
  export const ATTRIBUTES: VariableInfo = {
    types: {
      'testform.Person': [
        {
          attribute: 'address',
          description: '',
          simpleType: 'Address',
          type: 'testform.Address'
        },
        {
          attribute: 'birthday',
          description: '',
          simpleType: 'Number',
          type: 'Number'
        },
        {
          attribute: 'surname',
          description: '',
          simpleType: 'String',
          type: 'String'
        },
        {
          attribute: 'first name',
          description: '',
          simpleType: 'String',
          type: 'String'
        }
      ],
      'testform.Address': [
        {
          attribute: 'address',
          description: '',
          simpleType: 'String',
          type: 'String'
        }
      ],
      'testform.testForm.testFormData': [
        {
          attribute: 'data',
          description: '',
          simpleType: 'Data',
          type: 'testform.Data'
        }
      ],
      'testform.Data': [
        {
          attribute: 'persons',
          description: '',
          simpleType: 'List<Person>',
          type: 'List<testform.Person>'
        },
        {
          attribute: 'strings',
          description: '',
          simpleType: 'List<String>',
          type: 'List<String>'
        }
      ]
    },
    variables: [
      {
        attribute: 'data',
        description: '',
        simpleType: 'testFormData',
        type: 'testform.testForm.testFormData'
      }
    ]
  };
}
