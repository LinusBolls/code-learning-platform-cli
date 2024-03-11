import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the `Important Semester Dates` card on the `Dashboard` tab of the Learning Platform
 */
export const useLearningPlatformCurrentSemester = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'currentSemester'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw
        .query(`query importantSemesterDates {
            currentSemester {
              importantSemesterDates {
                title
                subtitle
                date
                __typename
              }
              __typename
            }
          }`);
      return data;
    },
    queryKey: ['learningPlatform', 'importantSemesterDates'],
    enabled,
    initialData: readJsonCacheSync(
      'learningPlatform-importantSemesterDates.cache.json'
    ),
  });
};
