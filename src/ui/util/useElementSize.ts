import { measureElement } from 'ink';
import { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

export function useElementSize(ref: any) {
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });

  useInterval(() => {
    if (ref.current) {
      const size = measureElement(ref.current);

      setElementSize(size);
    }
  }, 100);

  useEffect(() => {
    if (ref.current) {
      const size = measureElement(ref.current);

      setElementSize(size);
    }
  }, [ref]);

  return elementSize;
}
