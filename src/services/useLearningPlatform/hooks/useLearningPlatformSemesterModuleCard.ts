import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the `My Semester` card on the `Dashboard` tab of the Learning Platform
 */
export const useLearningPlatformSemesterModuleCard = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'mySemesterModules'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(`query semesterModuleCard {
        mySemesterModules {
          ...SemesterModuleCardInfo
          __typename
        }
      }
      
      fragment SemesterModuleCardInfo on ViewerTakenSemesterModule {
        id
        hasDuplicate
        moduleIdentifier
        status
        highestGrade
        module {
          id
          title
          shortCode
          simpleShortCode
          coordinator {
            id
            name
            __typename
          }
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
    queryKey: ['learningPlatform', 'semesterModuleCard'],
    enabled,
    initialData: readJsonCacheSync(
      'learningPlatform-semesterModuleCard.cache.json'
    ),
  });
};
