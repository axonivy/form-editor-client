import { BasicCollapsible, Button, Flex, IvyIcon, Tabs, TabsList, TabsTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ConditionGroup } from './ConditionGroup';
import { useConditionBuilderContext } from './ConditionBuilderContext';
import { SelectField } from '../SelectField';

interface ConditionBuilderProps {
  onChange: (value: string) => void;
  apply: () => void;
}

const conditionModes = [
  { label: 'Basic Condition', value: 'basic-condition' },
  { label: 'Nested Condition', value: 'nested-condition' },
  { label: 'Always True', value: 'always-true' },
  { label: 'Always False', value: 'always-false' }
] as const;
export type ConditionMode = (typeof conditionModes)[number]['value'];

export const ConditionBuilder = ({ onChange, apply }: ConditionBuilderProps) => {
  const { addConditionGroup, generateConditionString, conditionGroups, conditionMode, setConditionMode } = useConditionBuilderContext();
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
            <IvyIcon icon={IvyIcons.DataClass} />
            Condition
          </TabsTrigger>
        </TabsList>
        <Flex direction='column' gap={1} justifyContent='space-between' style={{ height: '100%', overflow: 'auto' }}>
          <Flex direction='column' gap={2}>
            <SelectField options={conditionModes} value={conditionMode} onChange={val => setConditionMode(val as ConditionMode)} />
            {conditionMode !== 'always-true' &&
              conditionMode !== 'always-false' &&
              conditionGroups
                .map((group, groupIndex) => {
                  if (conditionMode === 'basic-condition' && groupIndex > 0) return null;
                  return <ConditionGroup key={groupIndex} group={group} groupIndex={groupIndex} groupCount={conditionGroups.length} />;
                })
                .filter(Boolean)}
            {conditionMode === 'nested-condition' && (
              <Button onClick={addConditionGroup} icon={IvyIcons.Plus} aria-label='Add Condition Group' variant='outline'>
                Add Condition Group
              </Button>
            )}
            {conditionMode === 'basic-condition' && conditionGroups.length === 0 && (
              <Button onClick={addConditionGroup} icon={IvyIcons.Plus} aria-label='Add Condition' variant='outline'>
                Add Condition
              </Button>
            )}
          </Flex>
          <Flex direction='column' gap={3}>
            <BasicCollapsible label='Info' style={{ maxHeight: 50 }} className='condition-helptext'>
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
