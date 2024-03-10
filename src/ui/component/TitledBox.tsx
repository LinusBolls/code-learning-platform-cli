import { BoxStyle } from 'cli-boxes';
import { Box, BoxProps } from 'ink';
import React from 'react';

import { useTheme } from '../../services/useTheme/index.js';
import Divider, { DividerProps } from './Divider.js';

export interface TitledBoxProps
  extends BoxProps,
    Pick<
      DividerProps,
      'title' | 'titlePosition' | 'titleOffset' | 'titleProps'
    > {
  children?: React.ReactNode;
}

const emptyBoxStyle: BoxStyle = {
  top: ' ',
  topLeft: ' ',
  topRight: ' ',
  bottom: ' ',
  bottomLeft: ' ',
  bottomRight: ' ',
  left: ' ',
  right: ' ',
};

/**
 * todo: respect borderTopDimColor, borderDimColor
 *
 * pass `borderStyle={null}` for no border
 */
export default function TitledBox({
  children,
  title,
  titlePosition,
  titleProps,
  flexDirection = 'column',
  ...rest
}: TitledBoxProps) {
  const { theme } = useTheme();

  const borderStyle =
    rest.borderStyle === null ? emptyBoxStyle : rest.borderStyle ?? 'single';

  const topBorderStyle = rest.borderTop === false ? emptyBoxStyle : borderStyle;

  const borderColor =
    rest.borderColor === null ? undefined : theme.card.border.default;

  return (
    <Box flexDirection="column">
      <Divider
        title={title}
        titlePosition={titlePosition ?? 'start'}
        titleOffset={rest.titleOffset ?? 1}
        titleProps={titleProps ?? { color: theme.card.heading.default }}
        color={rest.borderTopColor ?? borderColor}
        startDir="down"
        endDir="down"
        borderStyle={topBorderStyle}
      />
      <Box
        borderColor={borderColor}
        borderStyle={borderStyle}
        {...rest}
        borderTop={false}
        flexDirection={flexDirection}
      >
        {children}
      </Box>
    </Box>
  );
}
