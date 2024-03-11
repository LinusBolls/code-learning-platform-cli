import spinners from 'cli-spinners';
import type { SpinnerName } from 'cli-spinners';
import { Box, Text } from 'ink';
import React, { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { useTheme } from '../../services/useTheme/index.js';

type Props = {
  /**
   * Type of a spinner.
   * See [cli-spinners](https://github.com/sindresorhus/cli-spinners) for available spinners.
   *
   * recommended: `dots`, `simpleDots`
   *
   * @default dots
   */
  type?: SpinnerName;

  color?: string;
};

export default function LoadingSpinner({ type = 'dots', color }: Props) {
  const [frame, setFrame] = useState(0);

  const spinner = spinners[type];

  const { theme } = useTheme();

  useInterval(() => {
    setFrame((prev) => {
      const isLastFrame = prev === spinner.frames.length - 1;
      return isLastFrame ? 0 : prev + 1;
    });
  }, spinner.interval);

  return (
    <Text color={color ?? theme.text.secondary}>{spinner.frames[frame]}</Text>
  );
}

export function LoadingText({ text = 'Loading' }: { text?: string }) {
  const { theme } = useTheme();

  return (
    <Box alignItems="center" justifyContent="center" flexGrow={1}>
      <Text color={theme.text.secondary}>{text}</Text>
      <LoadingSpinner type="simpleDots" />
    </Box>
  );
}
