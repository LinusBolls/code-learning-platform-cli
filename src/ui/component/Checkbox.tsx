import { Text } from 'ink';
import React from 'react';

import { useTheme } from '../../services/useTheme/index.js';

export interface CheckboxProps {
  label?: string;
  value?: boolean;
}
export default function Checkbox({ value = false, label }: CheckboxProps) {
  const { theme } = useTheme();

  return (
    <Text color={theme.text.default}>
      {value ? '☑' : '☐'}
      <Text color={theme.text.secondary}>{label ? ' ' + label : ''}</Text>
    </Text>
  );
}
