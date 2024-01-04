import type { Config } from '../../../types/config';
import { useData } from '../../../data/useData';
import './Properties.css';
import { PropertyItem } from './PropertyItem';

type PropertiesProps = {
  config: Config;
};

export const Properties = ({ config }: PropertiesProps) => {
  const { element } = useData();
  const propertyConfig = element ? config.components[element?.type] : undefined;
  return (
    <div className='properties'>
      <span className='properties-title'>Properties</span>
      {propertyConfig &&
        propertyConfig.fields &&
        Object.entries(propertyConfig.fields).map(([key, field]) => <PropertyItem key={key} fieldName={key} field={field} />)}
    </div>
  );
};
