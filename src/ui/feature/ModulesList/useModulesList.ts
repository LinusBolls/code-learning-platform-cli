import FuzzySearch from 'fuzzy-search';
import { useInput } from 'ink';
import { useState } from 'react';

import { useLearningPlatformModules } from '../../../services/useLearningPlatform/index.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { toModuleViewModel } from '../../util/mapping.js';

export default function useModulesList(isActive = true) {
  const modulesQuery = useLearningPlatformModules();

  const navigation = useNavigation();

  const modules = (modulesQuery.data?.modules ?? []).filter(
    (i) =>
      i.department != null &&
      i.semesterModules.some(
        (j: any) => j.semester.isActive && !j.isDraft && !j.hasDuplicate
      )
  );

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');

  if (!searchQuery.length)
    modules.sort((a, b) => a.shortCode.localeCompare(b.shortCode));

  useInput(
    (input, key) => {
      if (key.leftArrow && !isSearchFocused) {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
      }
      if (key.rightArrow && !isSearchFocused) {
        setCurrentPage((prev) => (prev < numPages - 1 ? prev + 1 : prev));
      }
      if (key.upArrow) {
        const idx = modules.findIndex(
          (module) => module.id === navigation.moduleId
        );
        if (idx > 0) {
          navigation.selectModule(modules[idx - 1]?.id);
        }
      }
      if (key.downArrow) {
        const idx = modules.findIndex(
          (module) => module.id === navigation.moduleId
        );
        if (idx < modules.length - 1) {
          navigation.selectModule(modules[idx + 1]?.id);
        }
      }
      if (input === 's') {
        setIsSearchFocused(true);
      }
      if (key.escape) {
        setIsSearchFocused(false);
      }
    },
    { isActive }
  );

  const searcher = new FuzzySearch(
    modules,
    [
      'title',
      'coordinator.name',
      'department.name',
      'shortCode',
      'moduleIdentifier',
    ],
    {
      sort: true,
    }
  );
  const searchResults = searcher.search(searchQuery);

  const modulesPerPage = 5;

  const numPages = modulesQuery.data
    ? Math.ceil(searchResults.length / modulesPerPage)
    : 0;

  const modulesToDisplay = searchResults.slice(
    currentPage * modulesPerPage,
    currentPage * modulesPerPage + modulesPerPage
  );
  const mappedModules = modulesToDisplay.map(toModuleViewModel);

  return {
    modules: mappedModules,
    numPages,
    currentPage,
    isSearchFocused,
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    isLoading: modulesQuery.isIdle || modulesQuery.isLoading,
    activeModuleId: navigation.moduleId,
  };
}
