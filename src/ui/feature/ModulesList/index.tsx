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
    myStudies: boolean;
    mySemester: boolean;
    passed: boolean;
    failed: boolean;
    mandatory: boolean;
    alternativeAssessment: boolean;
    earlyAssessment: boolean;
  };
  displayMode: 'table' | 'cards';
  withDivider?: boolean;
  columns: { width: number }[];
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
  displayMode,
  withDivider = true,
  columns,
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
        placeholder="S Search by name, study program, or professor"
        value={searchQuery}
        onChange={onSearchQueryChange}
      />
      <Box gap={6} paddingLeft={2} paddingBottom={1}>
        <Checkbox value={filter.mandatory} label="M Mandatory/Elective" />
        <Checkbox
          value={filter.alternativeAssessment}
          label="A Alternative assessment"
        />
        <Checkbox value={filter.earlyAssessment} label="E Early assessment" />
      </Box>
      <Box
        flexDirection="column"
        alignItems="center"
        flexGrow={1}
        padding={1}
        // height of the modules + height of the dividers - vertical padding
        height={
          modulesPerPage * (displayMode === 'cards' ? 2 : 1) +
          (withDivider ? modulesPerPage - 1 : 0) +
          2
        }
      >
        {modules.data!.length < 1 && (
          <Text color={theme.text.secondary}>No modules found.</Text>
        )}
        {modules.data!.map((module, idx) => {
          const isLast = idx === modules.data!.length - 1;

          const hasDivider = withDivider && !isLast;

          return (
            <Box
              key={module.id}
              flexDirection="column"
              width="100%"
              height={(displayMode === 'cards' ? 2 : 1) + (hasDivider ? 1 : 0)}
            >
              {displayMode === 'cards' ? (
                <ModuleCard
                  module={module}
                  isActive={module.id === activeModuleId}
                />
              ) : (
                <ModuleTableRow
                  columns={columns}
                  module={module}
                  isActive={module.id === activeModuleId}
                />
              )}
              {hasDivider && <Divider />}
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
export function ModuleCard({ module, isActive = false }: ModuleItemProps) {
  const { theme } = useTheme();

  return (
    <Box flexDirection="column" paddingLeft={isActive ? 2 : 0}>
      <Box gap={1}>
        {module.notOfferedThisSemester && (
          <Text
            bold
            backgroundColor={theme.module.retired.main}
            color={theme.highlight.active.main}
          >
            Unavailable
          </Text>
        )}
        {module.retired && (
          <Text
            bold
            backgroundColor={theme.module.retired.main}
            color={theme.highlight.active.main}
          >
            Retired
          </Text>
        )}
        <Text color={module.departmentColor} wrap="truncate" bold>
          {module.shortCode}
        </Text>
        <Text color={theme.text.default} wrap="truncate" bold>
          {module.title}
        </Text>
        <Text color={theme.text.secondary}>
          ({module.ects} ECTS
          {module.isMandatory ? ', mandatory' : ''}
          {module.isCompulsoryElective ? ', compulsory elective' : ''})
        </Text>
      </Box>
      <Text color={theme.text.secondary} wrap="truncate">
        {module.coordinatorName}
      </Text>
    </Box>
  );
}

export function ModuleTableRow({
  module,
  isActive = false,
  columns,
}: ModuleItemProps & { columns: { width: number }[] }) {
  const { theme } = useTheme();

  const bgColor = isActive ? theme.highlight.active.background : 'undefined';

  const gap = 2;

  return (
    <Box>
      <Box width={columns[0]!.width + gap}>
        <Text
          color={
            isActive ? theme.highlight.active.main : module.departmentColor
          }
          wrap="truncate"
          bold
          backgroundColor={bgColor}
        >
          {module.shortCode.padEnd(columns[0]!.width + gap, ' ')}
        </Text>
      </Box>
      <Box width={columns[1]!.width + gap}>
        <Text
          bold={isActive}
          color={isActive ? theme.highlight.active.main : theme.text.default}
          backgroundColor={bgColor}
        >
          {module.title.padEnd(columns[1]!.width + gap, ' ')}
        </Text>
      </Box>
      <Box width={columns[2]!.width + gap}>
        <Text
          bold={isActive}
          color={isActive ? theme.highlight.active.main : theme.text.secondary}
          wrap="truncate"
          backgroundColor={bgColor}
        >
          {module.coordinatorName.padEnd(columns[2]!.width + gap, ' ')}
        </Text>
      </Box>
      <Box width={columns[3]!.width}>
        <Text
          bold={isActive}
          color={isActive ? theme.highlight.active.main : theme.text.secondary}
          wrap="truncate"
          backgroundColor={bgColor}
        >
          {(module.ects + ' ECTS').padEnd(columns[3]!.width, ' ')}
        </Text>
      </Box>
    </Box>
  );
}
