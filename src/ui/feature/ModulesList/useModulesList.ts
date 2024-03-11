import FuzzySearch from 'fuzzy-search';
import { create, useStore } from 'zustand';

import { ExecutionContext } from '../../../services/cli/index.js';
import useInput from '../../../services/useInput/index.js';
import { useLearningPlatformModules } from '../../../services/useLearningPlatform/index.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { toModuleViewModel } from '../../util/mapping.js';
import { ModulesListProps } from './index.js';

const getNumModules = (screenHeight: number) => {
  // 9 lines are taken up by the breadcrumbs, searchbar, and pagination indicator, plus padding
  const modulesHeight = screenHeight - 11;

  let totalHeight = 0;
  let numModules = 0;

  while (totalHeight < modulesHeight) {
    numModules += 1;
    // a module row is 2 lines tall
    totalHeight += 2;

    const hasDivider = totalHeight + 2 < modulesHeight;

    if (hasDivider) {
      totalHeight += 1;
    }
  }
  return numModules;
};

interface ModulesListStore {
  currentPage: number;
  searchQuery: string;
  actions: {
    setSearchQuery: (query: string) => void;
    quitSearch: () => void;
    goToPage: (page: number) => void;
  };
}
const modulesListStore = create<ModulesListStore>((set) => ({
  searchQuery: '',
  currentPage: 0,
  actions: {
    setSearchQuery: (query) => set({ searchQuery: query }),
    quitSearch: () => set({ searchQuery: '' }),
    goToPage: (page) => set({ currentPage: page }),
  },
}));

export default function useModulesList(isActive = true): ModulesListProps {
  const store = useStore(modulesListStore);

  const modulesQuery = useLearningPlatformModules();

  const navigation = useNavigation();

  const modulesToDisplay = Object.values(
    (modulesQuery.data?.modules ?? [])
      .filter(
        (i) => i.department != null // i.semesterModules.some((j: any) => j.semester.isActive && !j.isDraft)
      )
      // we want only list a module once, even if it's available in multiple handbooks.
      // for example: right now, there are 2 active "Clean Code" modules, one for handbook v1 and one for handbook v2.
      // we only want one of them (doesn't really matter which one), and they have the same moduleIdentifier, so we'll only include one of them in this object.
      .reduce<Record<string, any>>((modulesById, module) => {
        modulesById[module.moduleIdentifier] = module;

        return modulesById;
      }, {})
  );
  if (!store.searchQuery.length)
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
  const searchResults = searcher.search(store.searchQuery.trim());

  const modulesPerPage = getNumModules(ExecutionContext.terminal.height);

  const numPages = Math.ceil(searchResults.length / modulesPerPage);

  if (store.currentPage > numPages - 1) {
    if (numPages > 0) {
      store.actions.goToPage(numPages - 1);
    } else if (store.currentPage > 0) {
      store.actions.goToPage(0);
    }
  }
  const modulesInList = searchResults.slice(
    store.currentPage * modulesPerPage,
    store.currentPage * modulesPerPage + modulesPerPage
  );
  const mappedModules = modulesInList.map(toModuleViewModel);

  useInput(
    (input, key) => {
      if (input === 's') {
        navigation.focus('modules:search');
        navigation.unselectModule();
      }
      if (key.escape) {
        navigation.unselectModule();
      }
      if (!navigation.canReceiveHotkeys) return;

      if (key.leftArrow) {
        if (store.currentPage > 0) {
          store.actions.goToPage(store.currentPage - 1);
          navigation.unselectModule();
        }
      }
      if (key.rightArrow) {
        if (store.currentPage < numPages - 1) {
          store.actions.goToPage(store.currentPage + 1);
          navigation.unselectModule();
        }
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
    onSearchSubmit: (openResultIfOnlyOne = true) => {
      navigation.unfocus();
      navigation.selectModule(modulesInList[0]?.id);
      if (openResultIfOnlyOne && modulesInList.length === 1) {
        navigation.openPage('module');
      }
    },
    onSearchCancel: () => {
      navigation.unfocus();
      store.actions.quitSearch();
    },

    modulesPerPage: modulesPerPage,
    modules: {
      isLoading: modulesQuery.isLoading,
      isError: modulesQuery.isLoadingError,
      data: mappedModules,
    },
    numPages,
    currentPage: store.currentPage,
    isSearchFocused: navigation.focusedId === 'modules:search',
    searchQuery: store.searchQuery,
    onSearchQueryChange: store.actions.setSearchQuery,
    activeModuleId: navigation.moduleId,
    breadcrumbsProps: {
      isLoading: modulesQuery.isFetching,
      isError: modulesQuery.isError,
    },
  };
}
