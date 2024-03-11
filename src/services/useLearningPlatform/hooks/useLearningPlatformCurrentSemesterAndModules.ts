import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the Learning Platform
 */
export const useLearningPlatformCurrentSemesterAndModules = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<
    QueryRes<'currentSemester'> &
      QueryRes<'semesters'> &
      QueryRes<'currentSemesterModules'>
  >({
    queryFn: async () => {
      const data = await learningPlatform!.raw
        .query(`query currentSemesterAndModules {
        currentSemester {
          startDate
          endDate
          __typename
        }
        semesters(fromPreviousSemester: true) {
          id
          name
          isActive
          __typename
        }
        currentSemesterModules {
          id
          moduleIdentifier
          hasDuplicate
          module {
            id
            title
            shortCode
            __typename
          }
          semester {
            isActive
            __typename
          }
          __typename
      }`);
      return data;
    },
    queryKey: ['learningPlatform', 'currentSemesterAndModules'],
    enabled,
    initialData: readJsonCacheSync(
      'learningPlatform-currentSemesterAndModules.cache.json'
    ),
  });
};
