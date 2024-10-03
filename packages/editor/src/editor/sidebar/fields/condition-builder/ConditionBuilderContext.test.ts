import { describe, expect } from 'vitest';
import { ConditionBuilderProvider, useConditionBuilderContext } from './ConditionBuilderContext';
import type { Condition, LogicalOperator } from './Condition';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

const renderConditionBuilderHook = () => renderHook(() => useConditionBuilderContext(), { wrapper: ConditionBuilderProvider });

describe('ConditionBuilderContext', () => {
  test('initialize with one condition group', () => {
    const { result } = renderConditionBuilderHook();

    expect(result.current.conditionGroups.length).toBe(1);
    expect(result.current.conditionGroups[0].conditions.length).toBe(1);
    expect(result.current.isConditionGroupEnabled).toBe(false);
  });

  test('add condition group', () => {
    const { result } = renderConditionBuilderHook();

    act(() => result.current.addConditionGroup());
    expect(result.current.conditionGroups.length).toBe(2);
  });

  test('remove condition group', () => {
    const { result } = renderConditionBuilderHook();

    act(() => result.current.addConditionGroup());
    expect(result.current.conditionGroups.length).toBe(2);

    act(() => result.current.removeConditionGroup(0));
    expect(result.current.conditionGroups.length).toBe(1);
  });

  test('add condition to a group', () => {
    const { result } = renderConditionBuilderHook();

    act(() => result.current.addCondition(0));
    expect(result.current.conditionGroups[0].conditions.length).toBe(2);
  });

  test('remove condition from group', () => {
    const { result } = renderConditionBuilderHook();

    act(() => result.current.addCondition(0));
    expect(result.current.conditionGroups[0].conditions.length).toBe(2);

    act(() => result.current.removeCondition(0, 1));
    expect(result.current.conditionGroups[0].conditions.length).toBe(1);
  });

  test('update condition in group', () => {
    const { result } = renderConditionBuilderHook();

    act(() => result.current.updateCondition(0, 0, 'argument1', 'testArg'));
    expect(result.current.conditionGroups[0].conditions[0].argument1).toBe('testArg');
  });

  test('update logical operator of group', () => {
    const { result } = renderConditionBuilderHook();

    act(() => result.current.updateLogicalOperator(0, 'or' as LogicalOperator));
    expect(result.current.conditionGroups[0].logicalOperator).toBe('or');
  });

  test('generate correct condition string', () => {
    const { result } = renderConditionBuilderHook();

    act(() => {
      result.current.updateCondition(0, 0, 'argument1', 'data.value');
      result.current.updateCondition(0, 0, 'operator', '==' as Condition['operator']);
      result.current.updateCondition(0, 0, 'argument2', '10');
    });

    const conditionString = result.current.generateConditionString();
    expect(conditionString).toBe("#{data.value == '10'}");
  });

  test('wrap arguments in quotes when needed', () => {
    const { result } = renderConditionBuilderHook();

    act(() => {
      result.current.updateCondition(0, 0, 'argument1', 'someString');
      result.current.updateCondition(0, 0, 'operator', '==' as Condition['operator']);
      result.current.updateCondition(0, 0, 'argument2', 'anotherString');
    });

    const conditionString = result.current.generateConditionString();
    expect(conditionString).toBe("#{'someString' == 'anotherString'}");
  });

  test('toggle condition group enabled state', () => {
    const { result } = renderConditionBuilderHook();

    act(() => result.current.setIsConditionGroupEnabled(true));
    expect(result.current.isConditionGroupEnabled).toBe(true);

    act(() => result.current.setIsConditionGroupEnabled(false));
    expect(result.current.isConditionGroupEnabled).toBe(false);
  });

  test('generate complex condition', () => {
    const { result } = renderConditionBuilderHook();

    act(() => {
      result.current.updateCondition(0, 0, 'argument1', 'data.value1');
      result.current.updateCondition(0, 0, 'operator', '==' as Condition['operator']);
      result.current.updateCondition(0, 0, 'argument2', '10');
      result.current.addCondition(0);
      result.current.updateCondition(0, 1, 'argument1', 'data.value2');
      result.current.updateCondition(0, 1, 'operator', '!=' as Condition['operator']);
      result.current.updateCondition(0, 1, 'argument2', '20');
    });

    act(() => {
      result.current.addConditionGroup();
      result.current.updateCondition(1, 0, 'argument1', 'value3');
      result.current.updateCondition(1, 0, 'operator', '>' as Condition['operator']);
      result.current.updateCondition(1, 0, 'argument2', '30');
      result.current.addCondition(1);
      result.current.updateCondition(1, 1, 'argument1', 'value4');
      result.current.updateCondition(1, 1, 'operator', '<=' as Condition['operator']);
      result.current.updateCondition(1, 1, 'argument2', '40');
    });

    act(() => {
      result.current.updateLogicalOperator(0, 'or');
    });

    const conditionString = result.current.generateConditionString();
    expect(conditionString).toBe("#{(data.value1 == '10' and data.value2 != '20') or ('value3' > '30' and 'value4' <= '40')}");
  });
});
