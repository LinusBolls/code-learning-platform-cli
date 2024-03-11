import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the Learning Platform
 */
export const useLearningPlatformMyNotifications = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'myNotifications'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(`query myNotifications {
        myNotifications {
          ...NotificationItem
          __typename
        }
      }
      
      fragment NotificationItem on Notification {
        id
        createdAt
        label
        link
        title
        urgency
        read
        __typename
      }`);
      return data;
    },
    queryKey: ['learningPlatform', 'myNotifications'],
    enabled,
    initialData: readJsonCacheSync(
      'learningPlatform-myNotifications.cache.json'
    ),
  });
};
