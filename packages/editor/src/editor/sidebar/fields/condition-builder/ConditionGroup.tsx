import { Button, Flex, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Condition, logicalOperatorOptions, type ConditionProps, type LogicalOperator } from './Condition';
import { SelectField } from '../SelectField';
import { useConditionBuilderContext } from './ConditionBuilderContext';

export interface ConditionGroup {
  conditions: Condition[];
  logicalOperator: LogicalOperator;
}

interface ConditionGroupProps extends Pick<ConditionProps, 'groupIndex'> {
  group: ConditionGroup;
  groupCount: number;
}

export const ConditionGroup = ({ group, groupIndex, groupCount }: ConditionGroupProps) => {
  const { updateLogicalOperator, addCondition, removeConditionGroup, conditionMode } = useConditionBuilderContext();

  return (
    <Flex direction='column' gap={2} className='condition-builder__group'>
      <Flex
        direction='column'
        style={
          conditionMode === 'nested-condition'
            ? { border: 'var(--basic-border', borderRadius: 'var(--border-r2)', padding: 'var(--size-2)' }
            : undefined
        }
        gap={2}
      >
        {conditionMode === 'nested-condition' && (
          <Flex direction='row' justifyContent='space-between'>
            <Label>{`Group ${groupIndex + 1}`}</Label>
            <Button onClick={() => removeConditionGroup(groupIndex)} icon={IvyIcons.Trash} aria-label='Remove Group' />
          </Flex>
        )}
        {group.conditions.map((condition, conditionIndex) => (
          <Condition
            key={conditionIndex}
            condition={condition}
            conditionIndex={conditionIndex}
            groupIndex={groupIndex}
            conditionsCount={group.conditions.length}
          />
        ))}
        <Button onClick={() => addCondition(groupIndex)} icon={IvyIcons.Plus} aria-label='Add Condition' variant='outline'>
          Add Condition
        </Button>
      </Flex>
      {groupIndex < groupCount - 1 && conditionMode === 'nested-condition' && (
        <SelectField
          options={logicalOperatorOptions}
          value={group.logicalOperator}
          onChange={val => updateLogicalOperator(groupIndex, val as LogicalOperator)}
        />
      )}
    </Flex>
  );
};
