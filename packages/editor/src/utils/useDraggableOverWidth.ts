import { useDndContext } from '@dnd-kit/core';
import { useState, useEffect } from 'react';

const useDraggableOverWidth = (initialWidth = 200) => {
  const { over } = useDndContext();
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    if (over && over?.rect.width !== width) {
      setWidth(over?.rect.width);
    }
  }, [over, width]);

  return width;
};

export default useDraggableOverWidth;
