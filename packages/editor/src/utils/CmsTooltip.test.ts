import type { ContentObject } from '@axonivy/form-editor-protocol';
import { findCmsEntries } from './CmsTooltip';

test('test cms entry search', async () => {
  const cmsTree: Array<ContentObject> = [
    {
      name: 'form-test-project',
      fullPath: '/',
      type: 'FOLDER',
      values: {},
      children: [
        {
          name: 'greetings',
          fullPath: '/greetings',
          type: 'FOLDER',
          values: {},
          children: [
            {
              name: 'hello',
              fullPath: '/greetings/hello',
              type: 'STRING',
              values: { en: 'Hello!' },
              children: []
            },
            {
              name: 'hello',
              fullPath: '/greetings/longEntry',
              type: 'STRING',
              values: {
                en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquam'
              },
              children: []
            }
          ]
        }
      ]
    }
  ];

  const cmsValidPath = '/greetings/hello';
  const cmsInvalidPath = '/notfound';
  const cmsLongPath = '/greetings/longEntry';

  expect(findCmsEntries(cmsValidPath, cmsTree)).toContain('en: Hello!');
  expect(findCmsEntries(cmsInvalidPath, cmsTree)).toContain('no cms entry found');
  expect(findCmsEntries(cmsLongPath, cmsTree)).toContain('en: Lorem ipsum dolor sit amet, consectetur ...');
});
