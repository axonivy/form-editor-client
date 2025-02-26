import { Button, Flex, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { modifyData, useData } from '../../../../data/data';

type ListItemWithActionsProps = {
  componentCid: string;
  label: string;
  icon?: string;
  isBound?: boolean;
};

export const ListItemWithActions = ({ componentCid, label, icon, isBound }: ListItemWithActionsProps) => {
  const { setData, setSelectedElement } = useData();
  return (
    <Flex
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      gap={1}
      style={{
        border: 'var(--basic-border)',
        borderRadius: 'var(--border-r1)',
        padding: 'var(--size-1)',
        paddingLeft: 'var(--size-2)'
      }}
      className='list-item-with-actions'
    >
      <Flex direction='row' gap={1} alignItems='center'>
        {icon && icon.length > 0 && <i className={icon} />}
        <Label title={isBound ? 'Column is bound to an object attribute' : ''}>{label}</Label>
      </Flex>

      <Flex direction='row' alignItems='center' gap={1}>
        <Button
          onClick={() => setData(oldData => modifyData(oldData, { type: 'remove', data: { id: componentCid } }).newData)}
          icon={IvyIcons.Trash}
          variant='outline'
        />
        <Button onClick={() => setSelectedElement(componentCid)} icon={IvyIcons.Edit} variant='outline' />
      </Flex>
    </Flex>
  );
};
