import { create } from 'zustand';

import {
  readSettingsSync,
  writeSettingsSync,
} from '../../../services/useFileSystem/index.js';
import useInput from '../../../services/useInput/index.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { useEventsListStore } from '../EventsList/useEventsList.js';
import { useModulesListStore } from '../ModulesList/useModulesList.js';
import { SettingsProps } from './index.js';

export interface UserPreferencesStore {
  isTableView: boolean;

  actions: {
    toggleTableView: () => void;
  };
}
const useUserPreferencesStore = create<UserPreferencesStore>((set) => ({
  isTableView: readSettingsSync().displayMode === 'table',

  actions: {
    toggleTableView: () =>
      set((state) => ({ isTableView: !state.isTableView })),
  },
}));

export default function useSettings(): SettingsProps {
  const preferencesStore = useUserPreferencesStore();

  const modulesListStore = useModulesListStore();
  const eventsListStore = useEventsListStore();

  const navigation = useNavigation();

  useInput((input) => {
    if (!navigation.canReceiveHotkeys) return;

    if (input.toLowerCase() === 't') {
      const displayMode = preferencesStore.isTableView ? 'cards' : 'table';

      modulesListStore.actions.setDisplayMode(displayMode);
      eventsListStore.actions.setDisplayMode(displayMode);

      preferencesStore.actions.toggleTableView();

      writeSettingsSync({ displayMode });
    }
  });

  return {
    preferences: {
      isTableView: preferencesStore.isTableView,
    },
  };
}
