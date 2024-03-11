import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the Learning Platform
 */
export const useLearningPlatformAnnouncementMessages = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'announcementMessages'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw
        .query(`query announcementMessages {
        announcementMessages {
          id
          title
          message
          type
          startTime
          endTime
          link
          buttonLabel
          __typename
        }
      }`);
      return data;
    },
    queryKey: ['learningPlatform', 'announcementMessages'],
    enabled,
    initialData: readJsonCacheSync(
      'learningPlatform-announcementMessages.cache.json'
    ),
  });
};
