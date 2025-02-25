import { Button, type CollapsibleControlProps } from '@axonivy/ui-components';
import { COLUMN_DROPZONE_ID_PREFIX, modifyData, useData } from '../../../../data/data';
import { IvyIcons } from '@axonivy/ui-icons';

export const ContentControls = (props: CollapsibleControlProps) => {
  const { element, setData } = useData();

  const createActionButton = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: { componentName: 'Button', targetId: COLUMN_DROPZONE_ID_PREFIX + element?.cid }
        }).newData
    );
  };

  return (
    element?.type === 'DataTableColumn' &&
    element.config.asActionColumn && (
      <Button icon={IvyIcons.Plus} onClick={createActionButton} size='small' title='Add new Action Column Button' {...props} />
    )
  );
};
