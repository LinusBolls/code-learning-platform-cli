import FuzzySearch from 'fuzzy-search';
import { create, useStore } from 'zustand';

import { ExecutionContext } from '../../../services/cli/index.js';
import useInput from '../../../services/useInput/index.js';
import { useLearningPlatformCurrentUser } from '../../../services/useLearningPlatform/hooks/useLearningPlatformCurrentUser.js';
import { useLearningPlatformModules } from '../../../services/useLearningPlatform/hooks/useLearningPlatformModules.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { toModuleViewModel } from '../../util/mapping.js';
import { ModulesListProps } from './index.js';

const getNumModules = (screenHeight: number) => {
  // 9 lines are taken up by the breadcrumbs, searchbar, search filters, and pagination indicator, plus padding
  const modulesHeight = screenHeight - 13;

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

  filter: {
    mandatory: boolean;
    alternativeAssessment: boolean;
    earlyAssessment: boolean;
  };

  actions: {
    setSearchQuery: (query: string) => void;
    quitSearch: () => void;
    goToPage: (page: number) => void;

    toggleMandatoryFilter: () => void;
    toggleAlternativeAssessmentFilter: () => void;
    toggleEarlyAssessmentFilter: () => void;
    resetFilters: () => void;
  };
}
const modulesListStore = create<ModulesListStore>((set) => ({
  searchQuery: '',
  currentPage: 0,
  filter: {
    mandatory: false,
    alternativeAssessment: false,
    earlyAssessment: false,
  },
  actions: {
    setSearchQuery: (query) => set({ searchQuery: query }),
    quitSearch: () => set({ searchQuery: '' }),
    goToPage: (page) => set({ currentPage: page }),
    toggleMandatoryFilter: () => {
      set((state) => ({
        filter: { ...state.filter, mandatory: !state.filter.mandatory },
      }));
    },
    toggleAlternativeAssessmentFilter: () => {
      set((state) => ({
        filter: {
          ...state.filter,
          alternativeAssessment: !state.filter.alternativeAssessment,
        },
      }));
    },
    toggleEarlyAssessmentFilter: () => {
      set((state) => ({
        filter: {
          ...state.filter,
          earlyAssessment: !state.filter.earlyAssessment,
        },
      }));
    },
    resetFilters: () => {
      set(() => ({
        filter: {
          mandatory: false,
          alternativeAssessment: false,
          earlyAssessment: false,
        },
      }));
    },
  },
}));

export default function useModulesList(isActive = true): ModulesListProps {
  const navigation = useNavigation();

  const modulesQuery = useLearningPlatformModules();

  const currentUserQuery = useLearningPlatformCurrentUser();

  const mandatoryModuleIds = currentUserQuery.data?.me.mandatoryModules ?? [];

  // currentUserQuery.data?.me.moduleHandbooks?.[0]?.moduleHandbook?.modules[0];

  const modules = modulesQuery.data?.currentSemesterModules ?? [];

  /** if there is an active search query, we want to sort by relevance, else by `simpleShortCode` */
  if (!filtersStore.searchQuery.length)
    modules.sort((a, b) =>
      a.module!.simpleShortCode.localeCompare(b.module!.simpleShortCode)
    );

  const search = new FuzzySearch(
    modules,
    [
      'module.title',
      'module.coordinator.name',
      'module.department.name',
      'module.shortCode',
    ],
    {
      sort: true,
    }
  );
  const modulesInList = search
    .search(filtersStore.searchQuery.trim())
    .filter((i) => {
      if (
        filtersStore.filter.mandatory &&
        !(
          mandatoryModuleIds.includes(i.module!.id + '|MANDATORY') ||
          mandatoryModuleIds.includes(i.module!.id + '|COMPULSORY_ELECTIVE')
        )
      )
        return false;

      if (
        filtersStore.filter.alternativeAssessment &&
        i.module!.semesterModules.some((i) => i.disabledAlternativeAssessment)
      )
        return false;

      if (
        filtersStore.filter.earlyAssessment &&
        i.module!.semesterModules.some((i) => !i.allowsEarlyAssessment)
      )
        return false;

      return true;
    });

  const modulesPerPage = getModulesPerPage(
    listStore.withDivider,
    listStore.displayMode,
    ExecutionContext.terminal.height
  );

  const mappedModules = modulesInList.map(
    toModuleViewModel(mandatoryModuleIds)
  );
  listStore.actions.setItems(mappedModules);

  listStore.actions.setItemsPerPage(modulesPerPage);

  const modulesOnScreen = listStore.getItemsOnPage();

  useInput(
    (input, key) => {
      if (input.toLowerCase() === 's') {
        navigation.focus('modules:search');
        navigation.unselectModule();
      }
      if (key.escape) {
        navigation.unselectModule();
      }
      if (!navigation.canReceiveHotkeys) return;

      if (input.toLowerCase() === 'm') {
        store.actions.toggleMandatoryFilter();
      }
      if (input.toLowerCase() === 'a') {
        store.actions.toggleAlternativeAssessmentFilter();
      }
      if (input.toLowerCase() === 'e') {
        store.actions.toggleEarlyAssessmentFilter();
      }

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
      if ((key.tab && !key.shift) || key.return || input === ' ') {
        if (listStore.selectedItemId && navigation.path === 'modules') {
          navigation.openPage('module', { moduleId: listStore.selectedItemId });
        }
      }
      }
    },
    { isActive }
  );

  return {
    onSearchSubmit: (openResultIfOnlyOne = true) => {
      navigation.unfocus();
        navigation.openPage('module', { moduleId });
      }
    },
    onSearchCancel: () => {
      navigation.unfocus();
      store.actions.quitSearch();
    },
    filter: store.filter,
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
