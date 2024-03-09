import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Divider from '../../component/Divider.js';

export interface ModuleInfoProps {
  isActive?: boolean;

  module: {
    shortCode: string;
    content: string;
    qualificationGoals: string;
  } | null;
}
export default function ModuleInfo({
  isActive = true,
  module,
}: ModuleInfoProps) {
  const { theme } = useTheme();

  const borderColor = isActive
    ? theme.card.border.active
    : theme.card.border.default;
  const titleColor = isActive
    ? theme.card.heading.active
    : theme.card.heading.default;

  if (!module)
    return (
      <Box flexDirection="column" flexGrow={1}>
        <Divider
          title={'Modules/Unknown'}
          titlePosition="start"
          color={borderColor}
          titleProps={{ color: titleColor }}
        />
        <Box
          flexDirection="column"
          flexGrow={1}
          alignItems="center"
          padding={1}
        >
          <Text color={theme.text.secondary}>This module does not exist.</Text>
        </Box>
      </Box>
    );

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Divider
        title={'Modules/' + module.shortCode}
        titlePosition="start"
        color={borderColor}
        titleProps={{ color: titleColor }}
      />
      <Text color={theme.text.default} wrap="wrap">
        {module.content}
      </Text>
      <Text color={theme.text.default} wrap="wrap">
        {module.qualificationGoals}
      </Text>
    </Box>
  );
}
