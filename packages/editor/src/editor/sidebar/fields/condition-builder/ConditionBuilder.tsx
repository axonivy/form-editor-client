import { BasicCheckbox, BasicCollapsible, Button, Flex, IvyIcon, Tabs, TabsList, TabsTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { ConditionGroup } from './ConditionGroup';

interface ConditionBuilderProps {
  onChange: (value: string) => void;
  apply: () => void;
}

export const ConditionBuilder = ({ onChange, apply }: ConditionBuilderProps) => {
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
      const logicGroupOp = index < conditionGroups.length - 1 ? ` ${group.logicalOperator.toLowerCase()} ` : '';
      return logicGroupOp === '' ? (conditionGroups.length === 1 ? conditions : `(${conditions})`) : `(${conditions}) ${logicGroupOp} `;
    });

    return `#{${groupStrings.join('')}}`;
  };

  const handleAddCondition = () => {
    const finalCondition = generateConditionString();
    onChange(finalCondition);
    apply();
  };

  return (
    <Tabs value='Condition' style={{ height: '100%', overflow: 'auto' }}>
      <Flex direction='column' gap={1} style={{ height: '100%' }}>
        <TabsList>
          <TabsTrigger value='Condition'>
            <IvyIcon icon={IvyIcons.Attribute} />
            Condition
          </TabsTrigger>
        </TabsList>
        <Flex direction='column' gap={1} justifyContent='space-between' style={{ height: '100%', overflow: 'auto' }}>
          <Flex direction='column' gap={2}>
            <BasicCheckbox
              label='Enable Grouping'
              checked={isConditionGroupEnabled}
              onCheckedChange={() => setIsConditionGroupEnabled(!isConditionGroupEnabled)}
              disabled={conditionGroups.length > 1 && isConditionGroupEnabled}
            />
            {conditionGroups.map((group, groupIndex) => (
              <ConditionGroup
                key={groupIndex}
                group={group}
                groupIndex={groupIndex}
                groupCount={conditionGroups.length}
                isConditionGroupEnabled={isConditionGroupEnabled}
                setConditionGroups={setConditionGroups}
              />
            ))}
            {(isConditionGroupEnabled || conditionGroups.length === 0) && (
              <Button onClick={addConditionGroup} icon={IvyIcons.Plus} aria-label='Add Condition Group' variant='outline'>
                {conditionGroups.length === 0 && !isConditionGroupEnabled ? 'Add Condition' : 'Add Condition Group'}
              </Button>
            )}
          </Flex>
          <Flex direction='column' gap={3}>
            <BasicCollapsible label='Info' style={{ maxHeight: 50 }}>
              {generateConditionString() || 'No condition defined yet'}
            </BasicCollapsible>
            <Flex justifyContent='flex-end' gap={2}>
              <Button onClick={() => apply()} aria-label='Cancel' size='large'>
                Cancel
              </Button>
              <Button onClick={handleAddCondition} aria-label='Apply Condition' size='large' variant='primary'>
                Apply
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Tabs>
  );
};
