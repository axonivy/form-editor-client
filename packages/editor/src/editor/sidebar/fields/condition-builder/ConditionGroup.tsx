import { Button, Flex, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Condition, logicalOperatorOptions, type ConditionProps, type LogicalOperator } from './Condition';
import { SelectField } from '../SelectField';

export interface ConditionGroup {
  conditions: Condition[];
  logicalOperator: LogicalOperator;
}

interface ConditionGroupProps extends Pick<ConditionProps, 'setConditionGroups' | 'groupIndex'> {
  group: ConditionGroup;
  groupCount: number;
  isConditionGroupEnabled: boolean;
}

export const ConditionGroup = ({ group, groupIndex, groupCount, isConditionGroupEnabled, setConditionGroups }: ConditionGroupProps) => {
  const updateLogicalOperator = (index: number, newValue: LogicalOperator) => {
    setConditionGroups(old => {
      const newGroups = [...old];
      newGroups[index].logicalOperator = newValue;
      return newGroups;
    });
  };

  const addCondition = (groupIndex: number) => {
    setConditionGroups(old => {
      const newGroups = [...old];
      newGroups[groupIndex].conditions.push({ argument1: '', operator: '==', argument2: '', logicalOperator: 'and' });
      return newGroups;
    });
  };

  const removeConditionGroup = (groupIndex: number) => {
    setConditionGroups(old => {
      const newGroups = [...old];
      newGroups.splice(groupIndex, 1);
      return newGroups;
    });
  };

  return (
    <Flex direction='column' gap={2}>
      <Flex
        direction='column'
        style={
          isConditionGroupEnabled ? { border: 'var(--basic-border', borderRadius: 'var(--border-r2)', padding: 'var(--size-2)' } : undefined
        }
        gap={2}
      >
        {isConditionGroupEnabled && (
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
            setConditionGroups={setConditionGroups}
          />
        ))}
        <Button onClick={() => addCondition(groupIndex)} icon={IvyIcons.Plus} aria-label='Add Condition' variant='outline'>
          Add Condition
        </Button>
      </Flex>
      {groupIndex < groupCount - 1 && (
        <SelectField
          options={logicalOperatorOptions}
          value={group.logicalOperator}
          onChange={val => updateLogicalOperator(groupIndex, val as LogicalOperator)}
        />
      )}
    </Flex>
  );
};
