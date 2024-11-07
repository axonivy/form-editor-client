import { useState } from 'react';

export type Selection = { start: number; end: number };
export type InputTextAreaRef = React.RefObject<HTMLInputElement> | React.RefObject<HTMLTextAreaElement>;

const useTextSelection = (ref: InputTextAreaRef) => {
  const [selection, setSelection] = useState<Selection | undefined>(undefined);
  const handleTextSelection = () => {
    if (ref.current) {
      const selectionStart = ref.current.selectionStart ?? 0;
      const selectionEnd = ref.current.selectionEnd ?? 0;
      if (selectionStart !== selectionEnd) {
        setSelection({ start: selectionStart, end: selectionEnd });
      } else {
        setSelection(undefined);
      }
    }
  };

  const getSelectedText = () => {
    if (ref.current && selection) {
      return ref.current.value.substring(selection.start, selection.end);
    }
    return '';
  };

  const showQuickFix = () => {
    if (!selection || !ref.current) {
      return false;
    }

    const selectedText = getSelectedText();
    const fullText = ref.current.value;

    // Check if selectedText contains only whitespace
    const selectedTextWithoutWhitespace = selectedText.replace(/\s/g, '');
    if (selectedTextWithoutWhitespace.length === 0) {
      return false;
    }

    // Check if selection contains #{ }
    const containsBrackets = selectedText.includes('#{') && selectedText.includes('}');
    if (containsBrackets) {
      return false;
    }

    // Check if selection is not surrounded by #{ }
    const textBeforeSelection = fullText.substring(0, selection.start);
    const hasOpeningBracketBefore = textBeforeSelection.includes('#{');
    const textAfterSelection = fullText.substring(selection.end);
    const hasClosingBracketAfter = textAfterSelection.includes('}');
    return !(hasOpeningBracketBefore && hasClosingBracketAfter);
  };

  return {
    selection,
    handleTextSelection,
    getSelectedText,
    showQuickFix
  };
};

export default useTextSelection;
