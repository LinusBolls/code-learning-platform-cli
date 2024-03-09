import { create } from 'zustand';

import { cli } from '../cli/index.js';

interface NavigationStore {
  moduleId: string | null;

  actions: {
    selectModule: (moduleId: string) => void;
    unselectModule: () => void;
  };
}
const navigationStore = create<NavigationStore>(() => ({
  moduleId: cli.flags.moduleId?.toLowerCase() ?? null,

  actions: {
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
    moduleId: store.moduleId,

    selectModule: store.actions.selectModule,
    unselectModule: store.actions.unselectModule,
  };
};
