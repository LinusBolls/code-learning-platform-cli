import { BoxStyle } from 'cli-boxes';
import { Box, BoxProps } from 'ink';
import React from 'react';

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
 */
export default function TitledBox({
  children,
  title,
  titlePosition,
  titleProps,
  ...rest
}: TitledBoxProps) {
  const borderStyle =
    rest.borderTop === false
      ? emptyBoxStyle
      : rest.borderStyle ?? emptyBoxStyle;

  return (
    <Box flexDirection="column">
      <Divider
        title={title}
        titlePosition={titlePosition ?? 'start'}
        titleOffset={rest.titleOffset ?? 1}
        titleProps={titleProps}
        color={rest.borderTopColor ?? rest.borderColor}
        startDir="down"
        endDir="down"
        borderStyle={borderStyle}
      />
      <Box {...rest} borderTop={false}>
        {children}
      </Box>
    </Box>
  );
}
