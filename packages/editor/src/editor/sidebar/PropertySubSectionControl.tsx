import { useData } from '../../data/data';
import { type CollapsibleControlProps } from '@axonivy/ui-components';
import { componentByName } from '../../components/components';

export const PropertySubSectionControl = ({ title, ...props }: CollapsibleControlProps & { title: string }) => {
  const { element } = useData();
  if (element === undefined) {
    return null;
  }
  const config = componentByName(element.type);
  if (config?.subSectionControls) {
    return config.subSectionControls(props, title);
  }
  return null;
};
