import { Button, Flex, Separator, Toolbar, ToolbarContainer } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../data/useData';

export const FormToolbar = () => {
  const { setSideBars } = useAppContext();
  return (
    <Toolbar>
      <Flex>
        <Flex gap={1}>
          <Button
            icon={IvyIcons.LayoutSidebarRightCollapse}
            size='large'
            rotate='180'
            onClick={() => setSideBars(old => ({ ...old, components: !old.components }))}
          />
          <Button icon={IvyIcons.SelectionTool} size='large' toggle={true} />
        </Flex>
        <ToolbarContainer width={450}>
          <Flex>
            <Separator orientation='vertical' style={{ height: '26px' }} />
            <Flex gap={1}>
              <Button icon={IvyIcons.Undo} size='large' />
              <Button icon={IvyIcons.Redo} size='large' />
            </Flex>
          </Flex>
        </ToolbarContainer>
      </Flex>
      <Flex>
        <Button
          icon={IvyIcons.LayoutSidebarRightCollapse}
          size='large'
          onClick={() => setSideBars(old => ({ ...old, properties: !old.properties }))}
        />
      </Flex>
    </Toolbar>
  );
};
