import FuzzySearch from 'fuzzy-search';
import { useState } from 'react';

import useInput from '../../../services/useInput/index.js';
import { useLearningPlatformModules } from '../../../services/useLearningPlatform/index.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { toModuleViewModel } from '../../util/mapping.js';

export default function useModulesList(isActive = true) {
  const modulesQuery = useLearningPlatformModules();

  const navigation = useNavigation();

  const modulesToDisplay = Object.values(
    (modulesQuery.data?.modules ?? [])
      // we want only list a module once, even if it's available in multiple handbooks.
      // for example: right now, there are 2 active "Clean Code" modules, one for handbook v1 and one for handbook v2.
      // we only want one of them (doesn't really matter which one), and they have the same moduleIdentifier, so we'll only include one of them in this object.
      .reduce<Record<string, any>>((modulesById, module) => {
        modulesById[module.moduleIdentifier] = module;

        return modulesById;
      }, {})
  );
  const [currentPage, setCurrentPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');

  if (!searchQuery.length)
    modulesToDisplay.sort((a, b) =>
      a.simpleShortCode.localeCompare(b.simpleShortCode)
    );

  const searcher = new FuzzySearch(
    modulesToDisplay,
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

  const modulesPerPage = 7;

  const numPages = Math.ceil(searchResults.length / modulesPerPage);

  if (currentPage > numPages - 1) {
    if (numPages > 0) {
      setCurrentPage(numPages - 1);
    } else if (currentPage > 0) {
      setCurrentPage(0);
    }
  }
  const modulesInList = searchResults.slice(
    currentPage * modulesPerPage,
    currentPage * modulesPerPage + modulesPerPage
  );
  const mappedModules = modulesInList.map(toModuleViewModel);

  useInput(
    (input, key) => {
      if (input === 's') {
        navigation.focus('modules:search');
      }
      if (!navigation.canReceiveHotkeys) return;

      if (key.leftArrow) {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
        navigation.unselectModule();
      }
      if (key.rightArrow) {
        setCurrentPage((prev) => (prev < numPages - 1 ? prev + 1 : prev));
        navigation.unselectModule();
      }
      if (key.upArrow) {
        const selected = modulesInList.findIndex(
          (i) => i.id === navigation.moduleId
        );
        if (selected === -1) {
          navigation.selectModule(modulesInList[modulesInList.length - 1]?.id);
        }
        if (selected > 0) {
          navigation.selectModule(modulesInList[selected - 1]?.id);
        }
      }
      if (key.downArrow) {
        const selected = modulesInList.findIndex(
          (i) => i.id === navigation.moduleId
        );
        if (selected === -1) {
          navigation.selectModule(modulesInList[0]?.id);
        }
        if (selected < modulesInList.length - 1) {
          navigation.selectModule(modulesInList[selected + 1]?.id);
        }
      }
    },
    { isActive }
  );

  return {
    modulesPerPage: modulesPerPage,
    modules: mappedModules,
    numPages,
    currentPage,
    isSearchFocused: navigation.focusedId === 'modules:search',
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    isLoading: modulesQuery.isLoading,
    activeModuleId: navigation.moduleId,
  };
}
