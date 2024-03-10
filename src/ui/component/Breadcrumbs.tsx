import { Box } from 'ink';
import React from 'react';

import { useTheme } from '../../services/useTheme/index.js';
import Divider from './Divider.js';
import LoadingSpinner from './LoadingSpinner.js';

export interface BreadcrumbsProps {
  steps: string[];
  isLoading?: boolean;
}
export default function Breadcrumbs({
  steps,
  isLoading = false,
}: BreadcrumbsProps) {
  const { theme } = useTheme();
  return (
    <Box gap={1}>
      <Divider
        title={steps.join('/')}
        titlePosition="start"
        color={theme.card.border.default}
        titleProps={{ color: theme.card.heading.default }}
      />
      {isLoading && <LoadingSpinner type="dots" color={theme.text.secondary} />}
    </Box>
  );
}
