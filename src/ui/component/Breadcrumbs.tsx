import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../services/useTheme/index.js';
import Divider from './Divider.js';
import LoadingSpinner from './LoadingSpinner.js';

export interface BreadcrumbsProps {
  steps: string[];
  isLoading?: boolean;
  isError?: boolean;
}
export default function Breadcrumbs({
  steps,
  isLoading = false,
  isError = false,
}: BreadcrumbsProps) {
  const { theme } = useTheme();
  return (
    <Box gap={1}>
      <Divider title={steps.join('/')} titlePosition="start" />
      {isLoading && !isError && <LoadingSpinner />}
      {isError && <Text color={theme.text.default}>⚠</Text>}
    </Box>
  );
}
