import { create } from 'zustand';

import { cli } from '../cli/index.js';

interface NavigationStore {
  pageId: string | null;
  focusedId: string | null;
  moduleId: string | null;

  actions: {
    openPage: (pageId: string) => void;

    focus: (id: string) => void;
    unfocus: () => void;

    selectModule: (moduleId: string) => void;
    unselectModule: () => void;
  };
}
const navigationStore = create<NavigationStore>(() => ({
  pageId: 'modules',
  focusedId: null,
  moduleId: cli.flags.moduleId?.toLowerCase() ?? null,

  actions: {
    openPage: (pageId: string) => {
      navigationStore.setState({ pageId });
    },
    focus: (focusedId: string) => {
      navigationStore.setState({ focusedId });
    },
    unfocus: () => {
      navigationStore.setState({ focusedId: null });
    },
    selectModule: (moduleId: string) => {
      navigationStore.setState({ moduleId });
    },
    unselectModule: () => {
      navigationStore.setState({ moduleId: null });
    },
  },
}));

export const useNavigation = () => {
  const store = navigationStore();

  return {
    pageId: store.pageId,
    canReceiveHotkeys: store.focusedId == null,
    focusedId: store.focusedId,
    moduleId: store.moduleId,

    selectModule: store.actions.selectModule,
    unselectModule: store.actions.unselectModule,
    focus: store.actions.focus,
    unfocus: store.actions.unfocus,
    openPage: store.actions.openPage,
  };
};
