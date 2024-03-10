import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Breadcrumbs from '../../component/Breadcrumbs.js';

export interface ModuleInfoProps {
  module: {
    shortCode: string;
    content: string;
    qualificationGoals: string;
  } | null;
}
export default function ModuleInfo({ module }: ModuleInfoProps) {
  const { theme } = useTheme();

  if (!module)
    return (
      <Box flexDirection="column" flexGrow={1}>
        <Breadcrumbs steps={['Modules', 'Unknown']} />
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
      <Breadcrumbs steps={['Modules', module.shortCode]} />
      <Box
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        padding={1}
        width="80%"
      >
        <Text color={theme.text.default} wrap="wrap">
          {module.content}
        </Text>
        <Text color={theme.text.default} wrap="wrap">
          {module.qualificationGoals}
        </Text>
      </Box>
    </Box>
  );
}
