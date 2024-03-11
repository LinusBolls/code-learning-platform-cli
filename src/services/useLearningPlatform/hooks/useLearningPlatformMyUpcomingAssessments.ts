import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the `My upcoming Assessments` card of the `Dashboard` tab of the Learning Platform
 */
export const useLearningPlatformMyUpcomingAssessments = (
  limit = 20,
  offset = 0
) => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'myUpcomingAssessments'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(
        `query myUpcomingAssessments($pagination: OffsetPaginationInput) {
        myUpcomingAssessments(pagination: $pagination) {
          id
          semesterModule {
            id
            __typename
          }
          module {
            title
            simpleShortCode
            __typename
          }
          event {
            id
            startTime
            endTime
            location
            remoteLocation
            __typename
          }
          assessor {
            id
            name
            __typename
          }
          __typename
        }
        myUpcomingAssessmentsCount
      }`,
        {
          pagination: {
            limit,
            offset,
          },
        }
      );
      return data;
    },
    queryKey: ['learningPlatform', 'myUpcomingAssessments'],
    enabled,
    initialData: readJsonCacheSync(
      'learningPlatform-myUpcomingAssessments.cache.json'
    ),
  });
};
