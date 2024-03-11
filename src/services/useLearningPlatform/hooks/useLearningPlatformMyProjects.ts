import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the `My Projects` card on the `Dashboard` tab of the Learning Platform
 */
export const useLearningPlatformMyProjects = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'myProjects'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(`query myProjects {
            myProjects {
              ...ProjectCardItem
              __typename
            }
          }
          
          fragment ProjectCardItem on Project {
            id
            isApproved
            isArchived
            title
            description
            coverUrl
            isLookingForTeammates
            tags {
              id
              name
              category
              __typename
            }
            semesters {
              id
              name
              __typename
            }
            originator {
              id
              name
              __typename
            }
            isFutureProject
            activeMemberships {
              id
              student {
                id
                firstName
                lastName
                avatarUrl
                __typename
              }
              __typename
            }
            __typename
          }`);
      return data;
    },
    queryKey: ['learningPlatform', 'myProjects'],
    enabled,
    initialData: readJsonCacheSync('learningPlatform-myProjects.cache.json'),
  });
};
