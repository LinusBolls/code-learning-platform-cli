import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the `Dashboard` tab of the Learning Platform
 *
 * the pagination is hardcoded because that's what the learning platform does lmao
 */
export const useLearningPlatformMyUpcomingEvents = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'myUpcomingEvents'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(`query myUpcomingEvents {
        myUpcomingEvents(pagination: {limit: 10}) {
          id
          title
          startTime
          endTime
          eventGroupId
          __typename
        }
      }`);
      return data;
    },
    queryKey: ['learningPlatform', 'myUpcomingEvents'],
    enabled,
    initialData: readJsonCacheSync(
      'learningPlatform-myUpcomingEvents.cache.json'
    ),
  });
};
