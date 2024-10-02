import { Button, Flex, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { InputFieldWithBrowser } from '../InputFieldWithBrowser';
import { SelectField } from '../SelectField';
import type { ConditionGroup } from './ConditionGroup';

const typeOptions = [
  { label: 'equal to', value: '==' },
  { label: 'not equal to', value: '!=' },
  { label: 'less than', value: '<' },
  { label: 'greater than', value: '>' },
  { label: 'less or equal to', value: '<=' },
  { label: 'greater or equal to', value: '>=' },
  { label: 'is true', value: 'isTrue' }
] as const;
type ConditionType = (typeof typeOptions)[number]['value'];

export const logicalOperatorOptions = [
  { label: 'and', value: 'and' },
  { label: 'or', value: 'or' }
] as const;
export type LogicalOperator = (typeof logicalOperatorOptions)[number]['value'];

export interface Condition {
  argument1: string;
  operator: ConditionType;
  argument2: string;
  logicalOperator: LogicalOperator;
}

export interface ConditionProps {
  condition: Condition;
  conditionIndex: number;
  groupIndex: number;
  conditionsCount: number;
  setConditionGroups: React.Dispatch<React.SetStateAction<ConditionGroup[]>>;
}

export const Condition = ({ condition, conditionIndex, groupIndex, conditionsCount, setConditionGroups }: ConditionProps) => {
  const updateCondition = <TKey extends keyof Condition>(
    groupIndex: number,
    conditionIndex: number,
    key: TKey,
    newValue: Condition[TKey]
  ) => {
    setConditionGroups(old => {
      const newGroups = [...old];
      newGroups[groupIndex].conditions[conditionIndex] = {
        ...newGroups[groupIndex].conditions[conditionIndex],
        [key]: newValue
      };
      return newGroups;
    });
  };

  const removeCondition = (groupIndex: number, conditionIndex: number) => {
    setConditionGroups(old => {
      const newGroups = [...old];
      newGroups[groupIndex].conditions.splice(conditionIndex, 1);
      return newGroups;
    });
  };

  return (
    <Flex direction='column' style={{ border: 'var(--basic-border', borderRadius: 'var(--border-r2)', padding: 'var(--size-2)' }}>
      <Flex direction='row' justifyContent='space-between'>
        <Label>{`Condition ${conditionIndex + 1}`}</Label>
        <Button onClick={() => removeCondition(groupIndex, conditionIndex)} icon={IvyIcons.Trash} aria-label='Remove Condition' />
      </Flex>
      <Flex alignItems='center' gap={2} direction='row'>
        <InputFieldWithBrowser
          value={condition.argument1}
          onChange={val => updateCondition(groupIndex, conditionIndex, 'argument1', val)}
          browsers={['ATTRIBUTE']}
          options={{ directApply: true }}
        />
        <SelectField
          options={typeOptions}
          value={condition.operator}
          onChange={val => updateCondition(groupIndex, conditionIndex, 'operator', val as ConditionType)}
          width='150px'
        />
        {condition.operator !== 'isTrue' && (
          <InputFieldWithBrowser
            value={condition.argument2}
            onChange={val => updateCondition(groupIndex, conditionIndex, 'argument2', val)}
            browsers={['ATTRIBUTE']}
            options={{ directApply: true }}
          />
        )}
        {conditionIndex < conditionsCount - 1 && (
          <SelectField
            options={logicalOperatorOptions}
            value={condition.logicalOperator}
            onChange={val => updateCondition(groupIndex, conditionIndex, 'logicalOperator', val as LogicalOperator)}
            width='70px'
          />
        )}
      </Flex>
    </Flex>
  );
};
