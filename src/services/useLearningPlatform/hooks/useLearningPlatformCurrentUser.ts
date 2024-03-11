import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the Learning Platform
 */
export const useLearningPlatformCurrentUser = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'me'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(`query currentUser {
        me {
          id
          firstName
          lastName
          name
          email
          avatarUrl
          role
          grants
          mandatoryModules
          permissions
          userEventStreamLink
          __typename
        }
        underMaintanance
      }`);
      return data;
    },
    queryKey: ['learningPlatform', 'currentUser'],
    enabled,
    initialData: readJsonCacheSync('learningPlatform-currentUser.cache.json'),
  });
};
