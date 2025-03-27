import { useData } from '../../data/data';
import { type CollapsibleControlProps } from '@axonivy/ui-components';
import { useSharedComponents } from '../../context/ComponentsContext';

export const usePropertySubSectionControl = () => {
  const { componentByName } = useSharedComponents();
  const { element } = useData();
  const PropertySubSectionControl = ({ title, ...props }: CollapsibleControlProps & { title: string }) => {
    if (element === undefined) {
      return null;
    }
    const config = componentByName(element.type);
    if (config?.subSectionControls) {
      return config.subSectionControls(props, title);
    }
    return null;
  };

  return {
    PropertySubSectionControl
  };
};
