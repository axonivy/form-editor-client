import type { DefaultComponentProps } from '../types/config';

export type ContentData = {
  id: string;
  type: string;
  props: DefaultComponentProps;
};

export type UiEditorData = {
  root: {};
  content: ContentData[];
};
