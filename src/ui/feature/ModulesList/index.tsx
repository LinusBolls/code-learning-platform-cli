import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Divider from '../../component/Divider.js';
import LoadingSpinner from '../../component/LoadingSpinner.js';
import PaginationIndicator from '../../component/PaginationIndicator.js';
import SearchBar from '../../component/SearchBar.js';

export interface Module {
  id: string;
  title: string;
  coordinatorName: string;
  departmentShortCode: string;
  departmentColor: string;
  ects: number;
  graded: boolean;
}
export interface ModulesListProps {
  activeModuleId?: string | null;
  isActive?: boolean;
  modules: Module[];
  numPages: number;
  currentPage: number;
  isSearchFocused: boolean;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isLoading?: boolean;
}
export default function ModulesList({
  activeModuleId,
  isActive = true,
  modules,
  numPages,
  currentPage,
  isSearchFocused,
  searchQuery,
  onSearchQueryChange,
  isLoading = false,
}: ModulesListProps) {
  const { theme } = useTheme();

  const borderColor = isActive
    ? theme.card.border.active
    : theme.card.border.default;
  const titleColor = isActive
    ? theme.card.heading.active
    : theme.card.heading.default;

  if (isLoading)
    return (
      <Box alignItems="center" justifyContent="center" flexGrow={1}>
        <LoadingSpinner />
      </Box>
    );

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Divider
        title="Modules"
        titlePosition="start"
        color={borderColor}
        titleProps={{ color: titleColor }}
      />
      <SearchBar
        isActive={isSearchFocused}
        placeholder="S Search by name, department, or coordinator"
        value={searchQuery}
        onChange={onSearchQueryChange}
      />
      <Box flexDirection="column" alignItems="center" flexGrow={1} padding={1}>
        {modules.length < 1 && (
          <Text color={theme.text.secondary}>No modules found.</Text>
        )}
        {modules.map((module, idx) => {
          const isLast = idx === modules.length - 1;

          return (
            <Box key={module.id} flexDirection="column" width="100%">
              <Box
                flexDirection="column"
                paddingLeft={activeModuleId === module.id ? 2 : 0}
              >
                <Box>
                  <Text color={module.departmentColor} wrap="truncate" bold>
                    {module.departmentShortCode}{' '}
                  </Text>
                  <Text color={theme.text.default} wrap="truncate" bold>
                    {module.title}
                  </Text>
                  <Text bold={false} color={theme.text.secondary}>
                    {' '}
                    ({module.ects} ECTS,{' '}
                    {module.graded ? 'graded' : 'not graded'})
                  </Text>
                </Box>
                <Text color={theme.text.secondary} wrap="truncate">
                  {module.coordinatorName}
                </Text>
              </Box>
              {!isLast && <Divider />}
            </Box>
          );
        })}
      </Box>
      <PaginationIndicator numPages={numPages} currentPage={currentPage} />
    </Box>
  );
}
