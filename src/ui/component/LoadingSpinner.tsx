import { Text } from 'ink';
import React, { useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { useTheme } from '../../services/useTheme/index.js';

export default function LoadingSpinner() {
  const [count, setCount] = useState(1);

  const { theme } = useTheme();

  useInterval(() => {
    setCount(count > 2 ? 1 : count + 1);
  }, 200);

  return <Text color={theme.text.secondary}>{'.'.repeat(count)}</Text>;
}
