import { Flex, IvyIcon, Message } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import './EmptyDetail.css';

type EmptyDetailProps = {
  message: string;
};

export const EmptyDetail = ({ message }: EmptyDetailProps) => {
  return (
    <Flex justifyContent='center' alignItems='center' direction='column' className='empty-detail'>
      <IvyIcon icon={IvyIcons.DragDrop} className='empty-detail-icon' />
      <Message className='empty-detail-message'>{message}</Message>
    </Flex>
  );
};
