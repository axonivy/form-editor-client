import { Button, Flex, IvyIcon, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { modifyData, useData } from '../../../../data/data';

type ListItemWithActionsProps = {
  componentCid: string;
  label: string;
  index: number;
  allItemsCount: number;
  isBound?: boolean;
};

export const ListItemWithActions = ({ componentCid, label, index, allItemsCount, isBound }: ListItemWithActionsProps) => {
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
        padding: 'var(--size-1)'
      }}
      className='list-item-with-actions'
    >
      <Flex direction='row' alignItems='center' gap={1}>
        {isBound && <IvyIcon icon={IvyIcons.Connector} title='Column is bound to an object attribute' />}
        <Label>{label}</Label>
      </Flex>
      <Flex direction='row' alignItems='center' gap={1}>
        {index < allItemsCount - 1 && (
          <Button
            onClick={() => setData(oldData => modifyData(oldData, { type: 'moveDown', data: { id: componentCid } }).newData)}
            icon={IvyIcons.ArrowRight}
            rotate={90}
            variant='outline'
          />
        )}
        {index > 0 && (
          <Button
            onClick={() => setData(oldData => modifyData(oldData, { type: 'moveUp', data: { id: componentCid } }).newData)}
            icon={IvyIcons.ArrowRight}
            rotate={270}
            variant='outline'
          />
        )}
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
