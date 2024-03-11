import { useQuery } from '@tanstack/react-query';
import { LP, QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the `Events` and `Academic Events` tabs of the Learning Platform
 * the `Events` tab doesn't specify a type, but `Academic Events` specifies `ACADEMIC`
 * both always specify a filter
 */
export const useLearningPlatformEventGroups = (
  limit = 20,
  offset = 0,
  filter?: LP.EventGroupFilter,
  type?: LP.EventGroupType
) => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'eventGroups'> & QueryRes<'eventGroupsCount'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(
        `query allEventGroups($pagination: OffsetPaginationInput, $filter: EventGroupFilter, $type: EventGroupType) {
            eventGroups(pagination: $pagination, filter: $filter, type: $type) {
              ...EventGroupCardItem
              __typename
            }
            eventGroupsCount(filter: $filter, type: $type)
          }
          
          fragment EventGroupCardItem on EventGroup {
            id
            title
            category
            type
            description
            imageUrl
            department {
              id
              abbreviation
              __typename
            }
            nextEvent {
              id
              startTime
              endTime
              location
              __typename
            }
            isInWaitingList
            isEventFull
            futureEventCount
            tags {
              id
              name
              __typename
            }
            maxParticipants
            participantCount
            isRegistered
            isHost
            canRegister
            canUnregister
            modules {
              id
              module {
                shortCode
                __typename
              }
              ...SemesterModuleLink
              __typename
            }
            organizers {
              id
              firstName
              lastName
              name
              email
              __typename
            }
            __typename
          }
          
          fragment SemesterModuleLink on SemesterModule {
            id
            semester {
              name
              id
              isActive
              __typename
            }
            module {
              ...SimpleModuleSummary
              __typename
            }
            moduleIdentifier
            __typename
          }
          
          fragment SimpleModuleSummary on Module {
            id
            title
            simpleShortCode
            shortCode
            graded
            coordinator {
              id
              name
              __typename
            }
            __typename
          }`,
        { pagination: { limit, offset }, filter, type }
      );
      return data;
    },
    queryKey: ['learningPlatform', 'eventGroups'],
    enabled,
    initialData: readJsonCacheSync('learningPlatform-eventGroups.cache.json'),
  });
};
