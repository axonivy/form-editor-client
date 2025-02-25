import { isColumn, type Button } from '@axonivy/form-editor-protocol';
import { Flex } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useData } from '../../../data/data';
import { ListItemWithActions } from '../datatable/fields/ListItemWithActions';

export type ActionButtonColumn = Button & { buttonCid: string };

export const ActionButtonsField = () => {
  const { element } = useData();

  const activeButtons = useMemo(
    () =>
      isColumn(element)
        ? element.config.components.map<ActionButtonColumn>(c => ({
            ...c.config,
            buttonCid: c.cid
          }))
        : [],
    [element]
  );

  return (
    <Flex direction='column' gap={1}>
      {activeButtons.map(button => (
        <ListItemWithActions key={button.buttonCid} componentCid={button.buttonCid} label={button.name} />
      ))}
    </Flex>
  );
};
