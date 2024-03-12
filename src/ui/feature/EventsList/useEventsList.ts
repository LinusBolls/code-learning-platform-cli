import useInput from '../../../services/useInput/index.js';
import { useLearningPlatformEventGroups } from '../../../services/useLearningPlatform/hooks/useLearningPlatformEventGroups.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { createListStore } from '../../util/createListStore.js';
import { getTableColumns } from '../../util/getColumns.js';
import { toEventViewModel } from '../../util/mapping.js';
import { toQueryDto } from '../../util/queryDTO.js';
import { EventsListProps } from './index.js';

const useEventsListStore =
  createListStore<ReturnType<typeof toEventViewModel>>();

export default function useEventsList(): EventsListProps {
  const listStore = useEventsListStore();

  const eventsQuery = useLearningPlatformEventGroups();

  const events = (eventsQuery.data?.eventGroups ?? []).map(toEventViewModel);

  listStore.actions.setItems(events);
  listStore.actions.setItemsPerPage(10);

  const navigation = useNavigation();

  useInput((_, key) => {
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
  });

  const columns = getTableColumns(events, [
    { key: 'creatorName', max: 20 },
    { key: 'title', max: 60 },
    { key: 'maxParticipants', plus: '100 / '.length },
  ]);

  return {
    columns,
    eventsPerPage: listStore.itemsPerPage,
    breadcrumbsProps: {
      isLoading: eventsQuery.isFetching,
      isError: eventsQuery.isError,
    },
    events: toQueryDto(eventsQuery, listStore.getItemsOnPage()),
    currentPage: listStore.currentPage,
    numPages: listStore.getNumPages(),
    selectedItemId: listStore.selectedItemId,
  };
}
