import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Condition, LogicalOperator } from './Condition';
import type { ConditionGroup } from './ConditionGroup';
import type { ConditionMode } from './ConditionBuilder';

interface ConditionContextType {
  conditionMode: ConditionMode;
  setConditionMode: (value: ConditionMode) => void;
  conditionGroups: ConditionGroup[];
  addConditionGroup: () => void;
  updateLogicalOperator: (index: number, newValue: LogicalOperator) => void;
  addCondition: (groupIndex: number) => void;
  removeConditionGroup: (groupIndex: number) => void;
  updateCondition: <TKey extends keyof Condition>(groupIndex: number, conditionIndex: number, key: TKey, newValue: Condition[TKey]) => void;
  removeCondition: (groupIndex: number, conditionIndex: number) => void;
  generateConditionString: () => string;
}

export const ConditionBuilderContext = createContext<ConditionContextType | undefined>(undefined);

export const ConditionBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [conditionMode, setConditionMode] = useState<ConditionMode>('basic-condition');
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([
    { conditions: [{ argument1: '', operator: 'eq', argument2: '', logicalOperator: 'and' }], logicalOperator: 'and' }
  ]);

  const addConditionGroup = () => {
    setConditionGroups([
      ...conditionGroups,
      { conditions: [{ argument1: '', operator: 'eq', argument2: '', logicalOperator: 'and' }], logicalOperator: 'and' }
    ]);
  };

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
      newGroups[groupIndex].conditions.push({ argument1: '', operator: 'eq', argument2: '', logicalOperator: 'and' });
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

  const getLogicalOperator = (index: number, totalConditions: number, logicalOperator: string) => {
    return index < totalConditions - 1 ? ` ${logicalOperator.toLowerCase()} ` : '';
  };

  const formatCondition = (con: Condition, formattedArg1: string, formattedArg2: string, logicalOp: string) => {
    switch (con.operator) {
      case 'isTrue':
        return `${formattedArg1}${logicalOp}`;
      case 'isFalse':
        return `!${formattedArg1}${logicalOp}`;
      case 'isEmpty':
        return `empty ${formattedArg1}${logicalOp}`;
      case 'isNotEmpty':
        return `not empty ${formattedArg1}${logicalOp}`;
      default:
        return `${formattedArg1} ${con.operator} ${formattedArg2}${logicalOp}`;
    }
  };

  const generateConditionString = () => {
    if (conditionMode === 'always-true') {
      return 'true';
    }
    if (conditionMode === 'always-false') {
      return 'false';
    }
    const wrapInQuotesIfNeeded = (arg: string) => {
      return arg.startsWith('data.') || arg === 'data' ? arg : `'${arg}'`;
    };

    const groupStrings = conditionGroups.map((group, index) => {
      if (conditionMode === 'basic-condition' && index > 0) return '';
      const conditions = group.conditions
        .map((con, conditionIndex) => {
          const formattedArg1 = wrapInQuotesIfNeeded(con.argument1);
          const formattedArg2 = wrapInQuotesIfNeeded(con.argument2);
          const logicalOp = getLogicalOperator(conditionIndex, group.conditions.length, con.logicalOperator);
          return formatCondition(con, formattedArg1, formattedArg2, logicalOp);
        })
        .join('');

      const logicGroupOp = index < conditionGroups.length - 1 ? group.logicalOperator.toLowerCase() : '';
      return conditionGroups.length === 1 || conditionMode === 'basic-condition'
        ? conditions
        : `(${conditions})${logicGroupOp ? ` ${logicGroupOp} ` : ''}`;
    });

    return `#{${groupStrings.join('')}}`;
  };

  return (
    <ConditionBuilderContext.Provider
      value={{
        conditionMode,
        setConditionMode,
        conditionGroups,
        addConditionGroup,
        updateLogicalOperator,
        addCondition,
        removeConditionGroup,
        updateCondition,
        removeCondition,
        generateConditionString
      }}
    >
      {children}
    </ConditionBuilderContext.Provider>
  );
};

export const useConditionBuilderContext = () => {
  const context = useContext(ConditionBuilderContext);
  if (!context) {
    throw new Error('useConditionContext must be used within a ConditionProvider');
  }
  return context;
};
