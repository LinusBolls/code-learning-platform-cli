import { create } from 'zustand';

import { cli } from '../cli/index.js';

interface NavigationStore {
  focusedId: string | null;
  moduleId: string | null;

  actions: {
    focus: (id: string) => void;
    unfocus: () => void;

    selectModule: (moduleId: string) => void;
    unselectModule: () => void;
  };
}
const navigationStore = create<NavigationStore>(() => ({
  focusedId: null,
  moduleId: cli.flags.moduleId?.toLowerCase() ?? null,

  actions: {
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
    canReceiveHotkeys: store.focusedId == null,
    focusedId: store.focusedId,
    moduleId: store.moduleId,

    selectModule: store.actions.selectModule,
    unselectModule: store.actions.unselectModule,
    focus: store.actions.focus,
    unfocus: store.actions.unfocus,
  };
};
