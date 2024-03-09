import { Box } from 'ink';
import React from 'react';

import { useTheme } from '../../services/useTheme/index.js';
import TextInput, { TextInputProps } from './TextInput.js';

export interface SearchBarProps extends TextInputProps {
  isActive: boolean;
}
export default function SearchBar({ isActive, ...rest }: SearchBarProps) {
  const { theme } = useTheme();

  const borderColor = isActive
    ? theme.input.border.active
    : theme.input.border.default;

  return (
    <Box paddingLeft={1} borderColor={borderColor} borderStyle="single">
      <TextInput {...rest} focus={isActive} />
    </Box>
  );
}
