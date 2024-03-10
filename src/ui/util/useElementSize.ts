import { measureElement } from 'ink';
import { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

export function useElementSize(ref: any) {
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });

  function check() {
    if (ref.current) {
      const size = measureElement(ref.current);

      if (
        size.width !== elementSize.width ||
        size.height !== elementSize.height
      )
        setElementSize(size);
    }
  }
  // to catch if the ref element resizes, which wouldn't affect the ref
  useInterval(check, 100);

  useEffect(check, [ref]);

  return elementSize;
}
