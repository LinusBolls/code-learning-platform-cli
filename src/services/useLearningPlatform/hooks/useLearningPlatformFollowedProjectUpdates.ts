import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the `My Project Updates` card on the `Dashboard` tab of the Learning Platform
 */
export const useLearningPlatformFollowedProjectUpdates = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'followedProjectUpdates'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw
        .query(`query followedProjectUpdates {
        followedProjectUpdates {
          ...FollowedProjectUpdate
          __typename
        }
      }
      fragment FollowedProjectUpdate on ProjectUpdate {
        id
        title
        needsHelp
        needsFeedback
        project {
          id
          title
          __typename
        }
        __typename
      }`);
      return data;
    },
    queryKey: ['learningPlatform', 'followedProjectUpdates'],
    enabled,
    initialData: readJsonCacheSync(
      'learningPlatform-followedProjectUpdates.cache.json'
    ),
  });
};
