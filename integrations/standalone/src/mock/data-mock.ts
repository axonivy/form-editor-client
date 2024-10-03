import type { FormData } from '@axonivy/form-editor-protocol';

export const data: FormData = {
  id: 'a5c1d16e-1d08-4e1f-a9f0-436c553a3881',
  config: {
    renderer: 'JSF',
    theme: ''
  },
  components: [
    {
      id: 'Layout-a5c1d16e-1d08-4e1f-a9f0-436c553a388f',
      type: 'Layout',
      config: {
        components: [
          {
            id: 'Input-c1fabd9a-d85a-4a03-af03-2371aae32b4a',
            type: 'Input',
            config: {
              label: 'Firstname',
              value: 'data.value',
              required: true,
              type: 'TEXT',
              mdSpan: '6',
              lgSpan: '8'
            }
          },
          {
            id: 'Input-faa1131b-89a3-48f3-b81b-089aaf23fae6',
            type: 'Input',
            config: {
              label: 'Lastname',
              value: 'data.value',
              required: false,
              type: 'TEXT',
              mdSpan: '6',
              lgSpan: '4'
            }
          },
          {
            id: 'Input-1',
            type: 'Input',
            config: {
              label: 'Address',
              lgSpan: '12'
            }
          },
          {
            id: 'Select-360dd44c-050a-4a2e-b66d-84f7ce49e758',
            type: 'Select',
            config: {
              label: 'City',
              mdSpan: '4'
            }
          },
          {
            id: 'Input-c01b43e9-72f3-40a4-8a94-70552890dc48',
            type: 'Input',
            config: {
              label: 'State',
              value: 'data.value',
              required: false,
              type: 'TEXT',
              mdSpan: '4',
              lgSpan: '4'
            }
          },
          {
            id: 'Input-fd6e7cf6-0d5d-4245-95ec-7fd53c0fbec3',
            type: 'Input',
            config: {
              label: 'Zip',
              value: 'data.value',
              required: false,
              type: 'TEXT',
              lgSpan: '2',
              mdSpan: '4'
            }
          }
        ],
        type: 'GRID',
        gridVariant: 'FREE'
      }
    },
    {
      id: 'Layout-98a996ec-0acd-4e60-9001-80b0a7c3d294',
      type: 'Layout',
      config: {
        components: [
          {
            id: 'Button-6a868ed3-323d-4187-b8ac-30f576e1853b',
            type: 'Button',
            config: {
              name: 'Cancel',
              action: '#{ivyWorkflowView.cancel()}',
              variant: 'SECONDARY',
              icon: ''
            }
          },
          {
            id: 'Button-7f311e7a-1450-456c-8628-50a09240f18e',
            type: 'Button',
            config: {
              name: 'Proceed',
              action: '#{logic.close}',
              variant: 'PRIMARY',
              icon: ''
            }
          }
        ],
        type: 'FLEX',
        justifyContent: 'END'
      }
    },
    {
      id: 'Fieldset-dd040544-90c6-47e3-867a-ee310c74391c',
      type: 'Fieldset',
      config: {
        legend: 'Legend',
        collapsible: true,
        disabled: false,
        collapsed: false,
        components: [
          {
            id: 'Input-c1fabd9a-a83c-4a03-af03-2371aae32b4a',
            type: 'Input',
            config: {
              label: 'Title',
              value: 'data.value',
              required: true,
              type: 'TEXT',
              mdSpan: '6',
              lgSpan: '8'
            }
          }
        ]
      }
    },
    {
      id: 'DataTable-a1ff78f7-0cb5-4a5f-902d-7b95b4e65a69',
      type: 'DataTable',
      config: {
        lgSpan: '6',
        mdSpan: '12',
        components: [
          {
            id: 'DataTableColumn-2392d412-47a3-4d25-af6f-1f9e08b83861',
            config: {
              header: 'birthday',
              value: 'birthday'
            }
          },
          {
            id: 'DataTableColumn-d5105b17-3059-4e8e-bb42-610b9f4257fa',
            config: {
              header: 'age',
              value: 'age'
            }
          },
          {
            id: 'DataTableColumn-ad2ee959-6d68-4f14-8680-93e4cb85f236',
            config: {
              header: 'first name',
              value: 'first name'
            }
          }
        ],
        label: 'Label',
        value: '#{data.data.persons}'
      }
    }
  ]
};
