import cliBoxes, { BoxStyle } from 'cli-boxes';
import { Box, Text, TextProps } from 'ink';
import React, { useRef } from 'react';

import { useTheme } from '../../services/useTheme/index.js';
import { useElementSize } from '../util/useElementSize.js';

export type DividerTitlePosition = 'start' | 'center' | 'end';

export interface DividerProps {
  titleOffset?: number;
  color?: string;
  title?: string;
  startDir?: 'straight' | 'up' | 'down';
  endDir?: 'straight' | 'up' | 'down';
  titlePosition?: DividerTitlePosition;

  titleProps?: TextProps;

  borderStyle?: BoxStyle | keyof cliBoxes.Boxes;
}

const getPaddings = (
  titlePosition: DividerTitlePosition,
  width: number,
  title: string,
  start: string,
  end: string
): [number, number] => {
  const half = (width - title.length) / 2;

  if (titlePosition === 'center') {
    return [Math.floor(half) - start.length, Math.ceil(half) - end.length];
  }
  if (titlePosition === 'start') {
    return [0, width - title.length - start.length - end.length];
  }
  if (titlePosition === 'end') {
    return [width - title.length - start.length - end.length, 0];
  }
  throw new Error('failed to resolve title position');
};

export default function Divider({
  titleOffset = 0,
  color,
  titleProps,
  title = '',
  titlePosition = 'center',
  borderStyle = 'single',
  startDir = 'straight',
  endDir = 'straight',
}: DividerProps) {
  const box: BoxStyle =
    typeof borderStyle === 'string'
      ? (cliBoxes[borderStyle] as BoxStyle)
      : borderStyle;

  const char = box.top;
  const start = (() => {
    if (startDir === 'straight') return '';
    if (startDir === 'up') return box.bottomLeft;
    if (startDir === 'down') return box.topLeft;

    throw new Error('failed to resolve start direction');
  })();
  const end = (() => {
    if (endDir === 'straight') return '';
    if (endDir === 'up') return box.bottomRight;
    if (endDir === 'down') return box.topRight;

    throw new Error('failed to resolve start direction');
  })();

  const dividerRef = useRef(null);

  const { width } = useElementSize(dividerRef);

  const { theme } = useTheme();

  const [padStart, padEnd] = getPaddings(
    titlePosition,
    width,
    title,
    start,
    end
  );

  return (
    <Box ref={dividerRef} flexGrow={1}>
      <Text wrap="end" color={color ?? theme.card.border.default}>
        {start + char.repeat(Math.max(padStart + titleOffset, 0))}
        <Text bold color={color ?? theme.card.heading.default} {...titleProps}>
          {title}
        </Text>
        {char.repeat(Math.max(padEnd - titleOffset, 0)) + end}
      </Text>
    </Box>
  );
}

// todo: truncate if too long
// todo: support 8 border styles
