/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UiComponentProps } from '../components/component';

export type ContentData = {
  id: string;
  type: string;
  props: UiComponentProps<any>;
};

export type UiEditorData = {
  root: any;
  content: ContentData[];
};
