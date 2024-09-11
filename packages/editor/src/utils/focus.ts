export const focusBracketContent = (e: Event, value: string, inputElement: HTMLInputElement | null) => {
  if (inputElement) {
    const match = value.match(/\(([^)]+)\)/);
    if (match) {
      e.preventDefault();
      const textToSelect = match[1];
      const startIndex = value.indexOf(textToSelect);
      const endIndex = startIndex + textToSelect.length;
      inputElement.focus();
      inputElement.setSelectionRange(startIndex, endIndex);
    }
  }
};
