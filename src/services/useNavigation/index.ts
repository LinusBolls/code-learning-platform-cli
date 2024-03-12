import { create } from 'zustand';

interface NavigationStore {
  params: Record<string, unknown>;
  path: string | null;
  focusedId: string | null;

  actions: {
    openPage: (path: string, params?: Record<string, unknown>) => void;

    focus: (id: string) => void;
    unfocus: () => void;
  };
}
const navigationStore = create<NavigationStore>((set) => ({
  params: {},
  path: 'modules',
  focusedId: null,

  actions: {
    openPage: (path, params = {}) => {
      set({ path, params });
    },
    focus: (focusedId) => {
      set({ focusedId });
    },
    unfocus: () => {
      set({ focusedId: null });
    },
  },
}));

export const useNavigation = () => {
  const store = navigationStore();

  return {
    path: store.path,
    params: store.params,
    canReceiveHotkeys: store.focusedId == null,
    focusedId: store.focusedId,

    focus: store.actions.focus,
    unfocus: store.actions.unfocus,
    openPage: store.actions.openPage,
  };
};
