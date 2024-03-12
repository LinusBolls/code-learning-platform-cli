import { Box, Text } from 'ink';
import React from 'react';

import { useTheme } from '../../../services/useTheme/index.js';
import Breadcrumbs, { BreadcrumbsProps } from '../../component/Breadcrumbs.js';
import Checkbox from '../../component/Checkbox.js';
import Divider from '../../component/Divider.js';
import { ErrorText, LoadingText } from '../../component/LoadingSpinner.js';
import PaginationIndicator from '../../component/PaginationIndicator.js';
import SearchBar from '../../component/SearchBar.js';
import { Module } from '../../util/mapping.js';

export interface ModulesListProps {
  isLoading?: boolean;
  modulesPerPage?: number;
  activeModuleId?: string | null;
  modules: { data?: Module[]; isLoading: boolean; isError: boolean };
  numPages?: number;
  currentPage?: number;
  isSearchFocused?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  onSearchSubmit?: (openResultIfOnlyOne?: boolean) => void;
  onSearchCancel?: () => void;
  breadcrumbsProps?: Omit<BreadcrumbsProps, 'steps'>;
  filter: {
    mandatory: boolean;
    alternativeAssessment: boolean;
    earlyAssessment: boolean;
  };
}
export default function ModulesList({
  modulesPerPage = 5,
  activeModuleId,
  modules,
  numPages = 1,
  currentPage = 0,
  isSearchFocused = false,
  searchQuery = '',
  onSearchQueryChange = () => {},
  onSearchSubmit,
  onSearchCancel,
  breadcrumbsProps,
  filter,
}: ModulesListProps) {
  const { theme } = useTheme();

  if (modules.isLoading)
    return (
      <Box flexDirection="column" flexGrow={1}>
        <Breadcrumbs steps={['Modules']} {...breadcrumbsProps} />
        <LoadingText text="Loading modules" />
      </Box>
    );

  if (modules.isError)
    return (
      <Box flexDirection="column" flexGrow={1}>
        <Breadcrumbs steps={['Modules']} {...breadcrumbsProps} />
        <ErrorText />
      </Box>
    );

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Breadcrumbs steps={['Modules']} {...breadcrumbsProps} />
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
      <Box gap={6} paddingLeft={2} paddingBottom={1}>
        <Checkbox
          value={filter.mandatory}
          label="M Mandatory/Compulsory Elective"
        />
        <Checkbox
          value={filter.alternativeAssessment}
          label="A Allows alternative assessment"
        />
        <Checkbox
          value={filter.earlyAssessment}
          label="E Allows early assessment"
        />
      </Box>
      <Box
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        padding={1}
        // height of the modules + height of the dividers - vertical padding
        height={modulesPerPage * 2 + (modulesPerPage - 1) + 2}
      >
        {modules.data!.length < 1 && (
          <Text color={theme.text.secondary}>No modules found.</Text>
        )}
        {modules.data!.map((module, idx) => {
          const isLast = idx === modules.data!.length - 1;

          return (
            <Box
              key={module.id}
              flexDirection="column"
              width="100%"
              height={isLast ? 2 : 3}
            >
              <ModuleItem
                module={module}
                isActive={module.id === activeModuleId}
              />
              {!isLast && <Divider />}
            </Box>
          );
        })}
      </Box>
      <PaginationIndicator numPages={numPages} currentPage={currentPage} />
    </Box>
  );
}

export interface ModuleItemProps {
  module: Module;
  isActive?: boolean;
}
export function ModuleItem({ module, isActive = false }: ModuleItemProps) {
  const { theme } = useTheme();

  return (
    <Box flexDirection="column" paddingLeft={isActive ? 2 : 0}>
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
          ({module.ects} ECTS, {module.graded ? 'graded' : 'not graded'})
        </Text>
      </Box>
      <Text color={theme.text.secondary} wrap="truncate">
        {module.coordinatorName}
      </Text>
    </Box>
  );
}
