import { Button, Flex, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { InputFieldWithBrowser } from '../InputFieldWithBrowser';
import { SelectField } from '../SelectField';
import { useConditionBuilderContext } from './ConditionBuilderContext';

const typeOptions = [
  { label: 'equal to', value: 'eq' },
  { label: 'not equal to', value: 'ne' },
  { label: 'is true', value: 'isTrue' },
  { label: 'is false', value: 'isFalse' },
  { label: 'is empty', value: 'isEmpty' },
  { label: 'is not empty', value: 'isNotEmpty' },
  { label: 'less than', value: 'lt' },
  { label: 'greater than', value: 'gt' },
  { label: 'less or equal to', value: 'le' },
  { label: 'greater or equal to', value: 'ge' }
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
}

export const Condition = ({ condition, conditionIndex, groupIndex, conditionsCount }: ConditionProps) => {
  const { updateCondition, removeCondition } = useConditionBuilderContext();

  return (
    <Flex
      direction='column'
      style={{ border: 'var(--basic-border', borderRadius: 'var(--border-r2)', padding: 'var(--size-2)' }}
      className='condition-builder__condition'
    >
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
        {condition.operator !== 'isTrue' &&
          condition.operator !== 'isFalse' &&
          condition.operator !== 'isEmpty' &&
          condition.operator !== 'isNotEmpty' && (
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
