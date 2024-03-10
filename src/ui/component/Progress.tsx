import chalk from 'chalk';
import { Box, Text } from 'ink';
import React, { useRef } from 'react';

import { useTheme } from '../../services/useTheme/index.js';
import { useElementSize } from '../util/useElementSize.js';

export interface ProgressProps {
  progressFloat: number;
  progressColor?: string;
  trackColor?: string;
  bgColor?: string;
}
export default function Progress({
  progressFloat,
  progressColor,
  trackColor,
  bgColor,
}: ProgressProps) {
  const boxRef = useRef(null);

  const { width } = useElementSize(boxRef);

  const usableWidth = Math.max(width - 2, 0);

  const clampedProgress =
    progressFloat < 0 ? 0 : progressFloat > 1 ? 1 : progressFloat;

  const numProgress = Math.round(usableWidth * clampedProgress);
  const numLeft = usableWidth - numProgress;

  const { theme } = useTheme();

  const content =
    chalk.hex(bgColor ?? theme.text.secondary)('[') +
    chalk.hex(progressColor ?? theme.text.default)('#'.repeat(numProgress)) +
    chalk.hex(trackColor ?? theme.text.secondary)('.'.repeat(numLeft)) +
    chalk.hex(bgColor ?? theme.text.secondary)(']');

  return (
    <Box ref={boxRef}>
      <Text wrap="end">{content}</Text>
    </Box>
  );
}
