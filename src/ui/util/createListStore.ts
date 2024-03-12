import { create } from 'zustand';

import { readSettingsSync } from '../../services/useFileSystem/index.js';

// TODO: calculate item height here
// TODO: calculate columns here

export interface ListStore<Item extends { id: string }> {
  items: Item[];
  selectedItemId: string | null;
  itemsPerPage: number;
  withDivider: boolean;
  displayMode: 'table' | 'cards';
  currentPage: number;
  actions: {
    /**
     * attempts to go to the next page
     *
     * @returns whether the current page was changed
     */
    goToNextPage: () => boolean;
    /**
     * attempts to go to the previous page
     *
     * @returns whether the current page was changed
     */
    goToPrevPage: () => boolean;
    /**
     * attempts to select the next item, or selects the first item if none is selected
     *
     * @returns whether the selected item was changed
     */
    selectNextItem: () => boolean;
    /**
     * attempts to select the previous item, or selects the last item if none is selected
     *
     * @returns whether the selected item was changed
     */
    selectPrevItem: () => boolean;
    selectItem: (selectedItemId: string) => void;
    setItems: (items: Item[]) => void;
    setItemsPerPage: (itemsPerPage: number) => void;
    unselectItems: () => void;
    setDisplayMode: (displayMode: 'table' | 'cards') => void;
  };
  getItemsOnPage: () => Item[];
  getNumPages: () => number;
}

/**
 * manages a paginated list of items, where one item is selectable at a time.
 */
export function createListStore<Item extends { id: string }>() {
  return create<ListStore<Item>>((set, get) => ({
    items: [],
    selectedItemId: null,
    itemsPerPage: 0,
    withDivider: true,
    displayMode: readSettingsSync().displayMode,
    currentPage: 0,
    actions: {
      goToNextPage: () => {
        const numPages = get().getNumPages();

        if (get().currentPage < numPages - 1) {
          set({ currentPage: get().currentPage + 1, selectedItemId: null });

          return true;
        }
        return false;
      },
      goToPrevPage: () => {
        if (get().currentPage > 0) {
          set({ currentPage: get().currentPage - 1, selectedItemId: null });

          return true;
        }
        return false;
      },
      selectNextItem: () => {
        if (get().selectedItemId === null) {
          set({ selectedItemId: get().getItemsOnPage()[0]!.id });

          return true;
        }
        const index = get()
          .getItemsOnPage()
          .findIndex((item) => item.id === get().selectedItemId);

        if (index < get().getItemsOnPage().length - 1) {
          set({ selectedItemId: get().getItemsOnPage()[index + 1]!.id });

          return true;
        }
        return false;
      },
      selectPrevItem: () => {
        if (get().selectedItemId === null) {
          set({
            selectedItemId:
              get().getItemsOnPage()[get().getItemsOnPage().length - 1]!.id,
          });

          return true;
        }
        const index = get()
          .getItemsOnPage()
          .findIndex((item) => item.id === get().selectedItemId);

        if (index > 0) {
          set({ selectedItemId: get().getItemsOnPage()[index - 1]!.id });

          return true;
        }
        return false;
      },
      selectItem: (selectedItemId) => set({ selectedItemId }),
      setItems: (items: Item[]) => {
        if (
          items.map((i) => i.id).join(',') !==
          get()
            .items.map((i) => i.id)
            .join(',')
        ) {
          set({ items });

          const numPages = get().getNumPages();

          if (get().currentPage >= numPages) {
            if (numPages > 0) {
              set({ currentPage: numPages - 1, selectedItemId: null });
            } else if (get().currentPage > 0) {
              set({ currentPage: 0, selectedItemId: null });
            }
          }
        }
      },
      setItemsPerPage: (itemsPerPage: number) => {
        if (itemsPerPage !== get().itemsPerPage) {
          set({ itemsPerPage });

          const numPages = get().getNumPages();

          if (get().currentPage >= numPages) {
            if (numPages > 0) {
              set({ currentPage: numPages - 1, selectedItemId: null });
            } else if (get().currentPage > 0) {
              set({ currentPage: 0, selectedItemId: null });
            }
          }
        }
      },
      unselectItems: () => {
        set({ selectedItemId: null });
      },
      setDisplayMode: (displayMode: 'table' | 'cards') => set({ displayMode }),
    },
    getItemsOnPage: () => {
      return get().items.slice(
        get().currentPage * get().itemsPerPage,
        get().currentPage * get().itemsPerPage + get().itemsPerPage
      );
    },
    getNumPages: () => {
      return Math.ceil(get().items.length / get().itemsPerPage);
    },
  }));
}
