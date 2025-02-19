import { Button, Flex, IvyIcon, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { modifyData, useData } from '../../../../data/data';

export const ListItemWithActions = ({
  componentCid,
  label,
  index,
  allItemsCount,
  isBound
}: {
  componentCid: string;
  label: string;
  index: number;
  allItemsCount: number;
  isBound?: boolean;
}) => {
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
    >
      <Flex direction='row' alignItems='center' gap={1}>
        {isBound && <IvyIcon icon={IvyIcons.Connector} title='Column is bound to an object attribute' />}
        <Label>{label}</Label>
      </Flex>
      <Flex direction='row' alignItems='center' gap={1}>
        <Button
          onClick={() => setData(oldData => modifyData(oldData, { type: 'remove', data: { id: componentCid } }).newData)}
          icon={IvyIcons.Plus}
          rotate={45}
          variant='outline'
        />
        <Button onClick={() => setSelectedElement(componentCid)} icon={IvyIcons.Edit} variant='outline' />
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
      </Flex>
    </Flex>
  );
};
