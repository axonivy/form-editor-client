import { useAppContext } from '../../../data/useData';
import { Textarea } from '@axonivy/ui-components';

export const DataStructure = () => {
  const { data, setData } = useAppContext();
  return <Textarea value={JSON.stringify(data, null, 2)} style={{ flex: '1' }} onChange={e => setData(() => JSON.parse(e.target.value))} />;
};
