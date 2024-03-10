import spinners from 'cli-spinners';
import type { SpinnerName } from 'cli-spinners';
import { Text } from 'ink';
import React, { useEffect, useState } from 'react';

import { useTheme } from '../../services/useTheme/index.js';

type Props = {
  /**
   * Type of a spinner.
   * See [cli-spinners](https://github.com/sindresorhus/cli-spinners) for available spinners.
   *
   * @default dots
   */
  type?: SpinnerName;

  color?: string;
};

/**
 * Spinner.
 */
function Spinner({ type = 'dots', color }: Props) {
  const [frame, setFrame] = useState(0);
  const spinner = spinners[type];

  const { theme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((previousFrame) => {
        const isLastFrame = previousFrame === spinner.frames.length - 1;
        return isLastFrame ? 0 : previousFrame + 1;
      });
    }, spinner.interval);

    return () => {
      clearInterval(timer);
    };
  }, [spinner]);

  return (
    <Text color={color ?? theme.text.secondary}>{spinner.frames[frame]}</Text>
  );
}

export default Spinner;
