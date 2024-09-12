import { type ComponentData, isStructure } from '@axonivy/form-editor-protocol';
import { type OutlineNode, Outline } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { componentByName } from '../../components/components';
import { useData } from '../../data/data';

const iconByCategory = (category: string) => {
  switch (category) {
    case 'Elements':
      return IvyIcons.ChangeType;
    case 'Structure':
      return IvyIcons.LaneSwimlanes;
    case 'Action':
      return IvyIcons.MultiSelection;
  }
  return undefined;
};

const toOutlineNodes = (components: Array<ComponentData>): Array<OutlineNode> =>
  components.map<OutlineNode>(component => {
    const config = componentByName(component.type);
    let children: Array<OutlineNode> = [];
    if (isStructure(component)) {
      children = toOutlineNodes(component.config.components);
    }
    return {
      id: component.id,
      title: component.type,
      info: config.outlineInfo(component.config),
      icon: iconByCategory(config.category),
      children
    };
  });

export const FormOutline = ({ hideOutline }: { hideOutline: () => void }) => {
  const { data, element, setSelectedElement } = useData();
  const outlineData = toOutlineNodes(data.components);
  return <Outline outline={outlineData} selection={element?.id} onClick={setSelectedElement} onDoubleClick={hideOutline} />;
};
