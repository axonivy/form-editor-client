import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Condition, LogicalOperator } from './Condition';
import type { ConditionGroup } from './ConditionGroup';

interface ConditionContextType {
  isConditionGroupEnabled: boolean;
  setIsConditionGroupEnabled: (value: boolean) => void;
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
  const [isConditionGroupEnabled, setIsConditionGroupEnabled] = useState(false);
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([
    { conditions: [{ argument1: '', operator: '==', argument2: '', logicalOperator: 'and' }], logicalOperator: 'and' }
  ]);

  const addConditionGroup = () => {
    setConditionGroups([
      ...conditionGroups,
      { conditions: [{ argument1: '', operator: '==', argument2: '', logicalOperator: 'and' }], logicalOperator: 'and' }
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

  const generateConditionString = () => {
    const wrapInQuotesIfNeeded = (arg: string) => {
      return arg.startsWith('data.') || arg === 'data' ? arg : `'${arg}'`;
    };

    const groupStrings = conditionGroups.map((group, index) => {
      const conditions = group.conditions
        .map((con, index) => {
          const formattedArg1 = wrapInQuotesIfNeeded(con.argument1);
          const formattedArg2 = wrapInQuotesIfNeeded(con.argument2);
          const condition = `${formattedArg1} ${con.operator} ${formattedArg2}`;
          const logicalOp = index < group.conditions.length - 1 ? ` ${con.logicalOperator.toLowerCase()} ` : '';
          return con.operator === 'isTrue' ? formattedArg1 : condition + logicalOp;
        })
        .join('');

      const logicGroupOp = index < conditionGroups.length - 1 ? group.logicalOperator.toLowerCase() : '';
      return conditionGroups.length === 1 ? conditions : `(${conditions})${logicGroupOp ? ` ${logicGroupOp} ` : ''}`;
    });

    return `#{${groupStrings.join('')}}`;
  };

  return (
    <ConditionBuilderContext.Provider
      value={{
        isConditionGroupEnabled,
        setIsConditionGroupEnabled,
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
