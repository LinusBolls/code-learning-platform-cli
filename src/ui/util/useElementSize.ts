import { measureElement } from 'ink';
import { useEffect, useState } from 'react';

export function useElementSize(ref: any) {
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      const size = measureElement(ref.current);

      setElementSize(size);
    }
  }, [ref]);

  return elementSize;
}
