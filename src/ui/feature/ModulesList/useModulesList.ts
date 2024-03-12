import FuzzySearch from 'fuzzy-search';
import { create, useStore } from 'zustand';

import { ExecutionContext } from '../../../services/cli/index.js';
import useInput from '../../../services/useInput/index.js';
import { useLearningPlatformCurrentUser } from '../../../services/useLearningPlatform/hooks/useLearningPlatformCurrentUser.js';
import { useLearningPlatformModules } from '../../../services/useLearningPlatform/hooks/useLearningPlatformModules.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { createListStore } from '../../util/createListStore.js';
import { getTableColumns } from '../../util/getColumns.js';
import { toModuleViewModel } from '../../util/mapping.js';
import { ModulesListProps } from './index.js';

const useModulesListStore =
  createListStore<ReturnType<ReturnType<typeof toModuleViewModel>>>();

const getModulesPerPage = (
  withDivider: boolean,
  displayMode: 'cards' | 'table',
  screenHeight: number
) => {
  // 9 lines are taken up by the breadcrumbs, searchbar, search filters, and pagination indicator, plus padding
  const modulesHeight = screenHeight - 13;

  let totalHeight = 0;
  let numModules = 0;

  while (totalHeight < modulesHeight) {
    numModules += 1;
    totalHeight += displayMode === 'cards' ? 2 : 1;

    const hasDivider = withDivider && totalHeight + 2 < modulesHeight;

    if (hasDivider) {
      totalHeight += 1;
    }
  }
  return numModules;
};

interface ModulesFilterStore {
  searchQuery: string;

  filter: {
    mandatory: boolean;
    alternativeAssessment: boolean;
    earlyAssessment: boolean;
  };

  actions: {
    setSearchQuery: (query: string) => void;
    quitSearch: () => void;

    toggleMandatoryFilter: () => void;
    toggleAlternativeAssessmentFilter: () => void;
    toggleEarlyAssessmentFilter: () => void;
    resetFilters: () => void;
  };
}
const modulesFilterStore = create<ModulesFilterStore>((set) => ({
  searchQuery: '',
  filter: {
    mandatory: false,
    alternativeAssessment: false,
    earlyAssessment: false,
  },
  actions: {
    setSearchQuery: (query) => set({ searchQuery: query }),
    quitSearch: () => set({ searchQuery: '' }),
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
  const filtersStore = useStore(modulesFilterStore);

  const listStore = useModulesListStore();

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
      if (!navigation.canReceiveHotkeys) return;

      if (key.escape) {
        listStore.actions.unselectItems();
      }
      if (key.leftArrow) {
        listStore.actions.goToPrevPage();
      }
      if (key.rightArrow) {
        listStore.actions.goToNextPage();
      }
      if (key.upArrow) {
        listStore.actions.selectPrevItem();
      }
      if (key.downArrow) {
        listStore.actions.selectNextItem();
      }
      if ((key.tab && !key.shift) || key.return || input === ' ') {
        if (listStore.selectedItemId && navigation.path === 'modules') {
          navigation.openPage('module', { moduleId: listStore.selectedItemId });
        }
      }
      if (input.toLowerCase() === 's') {
        navigation.focus('modules:search');
        listStore.actions.unselectItems();
      }
      if (input.toLowerCase() === 'm') {
        filtersStore.actions.toggleMandatoryFilter();
      }
      if (input.toLowerCase() === 'a') {
        filtersStore.actions.toggleAlternativeAssessmentFilter();
      }
      if (input.toLowerCase() === 'e') {
        filtersStore.actions.toggleEarlyAssessmentFilter();
      }
    },
    { isActive }
  );
  // @ts-expect-error
  const columns = getTableColumns(mappedModules, [
    { key: 'shortCode' },
    { key: 'title', max: 50 },
    { key: 'coordinatorName', max: 20 },
    { key: 'ects', plus: ' ECTS'.length },
  ]);

  return {
    onSearchSubmit: (openResultIfOnlyOne = true) => {
      navigation.unfocus();
      if (openResultIfOnlyOne && modulesOnScreen.length === 1) {
        const moduleId = modulesOnScreen[0]!.id;

        listStore.actions.selectItem(moduleId);

        navigation.openPage('module', { moduleId });
      }
    },
    onSearchCancel: () => {
      navigation.unfocus();
      filtersStore.actions.quitSearch();
    },
    filter: filtersStore.filter,
    modulesPerPage,
    modules: {
      isLoading: modulesQuery.isLoading,
      isError: modulesQuery.isLoadingError,
      data: modulesOnScreen,
    },
    numPages: listStore.getNumPages(),
    currentPage: listStore.currentPage,
    isSearchFocused: navigation.focusedId === 'modules:search',
    searchQuery: filtersStore.searchQuery,
    onSearchQueryChange: filtersStore.actions.setSearchQuery,
    activeModuleId: listStore.selectedItemId,
    breadcrumbsProps: {
      isLoading: modulesQuery.isFetching,
      isError: modulesQuery.isError,
    },
    displayMode: listStore.displayMode,
    withDivider: listStore.withDivider,
    columns,
  };
}
