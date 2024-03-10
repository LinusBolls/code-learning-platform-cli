import { Box, Text } from 'ink';
import React from 'react';

import { useLearningPlatformModules } from '../../../services/useLearningPlatform/index.js';
import { useTheme } from '../../../services/useTheme/index.js';
import Breadcrumbs from '../../component/Breadcrumbs.js';
import Divider from '../../component/Divider.js';
import LoadingSpinner from '../../component/LoadingSpinner.js';
import PaginationIndicator from '../../component/PaginationIndicator.js';
import SearchBar from '../../component/SearchBar.js';

export interface Module {
  id: string;
  title: string;
  coordinatorName: string;
  shortCode: string;
  departmentShortCode: string;
  departmentColor: string;
  ects: number;
  graded: boolean;
  retired: boolean;
}
export interface ModulesListProps {
  modulesPerPage: number;
  activeModuleId?: string | null;
  modules: Module[];
  numPages: number;
  currentPage: number;
  isSearchFocused?: boolean;
  searchQuery?: string;
  onSearchQueryChange: (query: string) => void;
  isLoading?: boolean;
  onSearchSubmit?: (openResultIfOnlyOne?: boolean) => void;
  onSearchCancel?: () => void;
}
export default function ModulesList({
  modulesPerPage,
  activeModuleId,
  modules,
  numPages,
  currentPage,
  isSearchFocused = false,
  searchQuery = '',
  onSearchQueryChange,
  isLoading = false,
  onSearchSubmit,
  onSearchCancel,
}: ModulesListProps) {
  const { theme } = useTheme();

  const modulesQuery = useLearningPlatformModules();

  if (isLoading)
    return (
      <Box flexDirection="column" flexGrow={1}>
        <Breadcrumbs
          steps={['Modules']}
          isLoading={modulesQuery.isFetching}
          isError={modulesQuery.isError}
        />
        <Box alignItems="center" justifyContent="center" flexGrow={1}>
          <Text color={theme.text.secondary}>Loading modules</Text>
          <LoadingSpinner type="simpleDots" />
        </Box>
      </Box>
    );

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Breadcrumbs
        steps={['Modules']}
        isLoading={modulesQuery.isFetching}
        isError={modulesQuery.isError}
      />
      <SearchBar
        onInput={(_, key) => {
          if (key.downArrow || key.tab) onSearchSubmit?.(false);
        }}
        onSubmit={() => onSearchSubmit?.()}
        onCancel={onSearchCancel}
        isActive={isSearchFocused}
        placeholder="S Search by name, department, or coordinator"
        value={searchQuery}
        onChange={onSearchQueryChange}
      />
      <Box
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        padding={1}
        // height of the modules + height of the dividers - vertical padding
        height={modulesPerPage * 2 + (modulesPerPage - 1) + 2}
      >
        {modules.length < 1 && (
          <Text color={theme.text.secondary}>No modules found.</Text>
        )}
        {modules.map((module, idx) => {
          const isLast = idx === modules.length - 1;

          return (
            <Box
              key={module.id}
              flexDirection="column"
              width="100%"
              height={isLast ? 2 : 3}
            >
              <Box
                flexDirection="column"
                paddingLeft={activeModuleId === module.id ? 2 : 0}
              >
                <Box>
                  <Text color={module.departmentColor} wrap="truncate" bold>
                    {module.shortCode}{' '}
                  </Text>
                  {module.retired && (
                    <Text
                      bold
                      backgroundColor={theme.module.retired.main}
                      color={theme.highlight.active.main}
                    >
                      Retired
                    </Text>
                  )}
                  <Text color={theme.text.default} wrap="truncate" bold>
                    {module.retired && ' '}
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
