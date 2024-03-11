import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

export const useLearningPlatformModules = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'modules'>>({
    queryFn: async () => {
      const { modulesCount } = await learningPlatform!.raw.query(`
        query {
          modulesCount
        }`);
      const modulesPerQuery = 100;

      const numQueries = Math.ceil(modulesCount / modulesPerQuery);

      let results = [];

      for (const idx of Array.from({ length: numQueries }).map(
        (_, idx) => idx
      )) {
        results.push(
          await learningPlatform!.raw.query(query, {
            pagination: {
              limit: modulesPerQuery,
              offset: idx * modulesPerQuery,
            },
          })
        );
      }
      const modules = results.flatMap((d) => d.modules);

      return {
        modules,
      };
    },
    queryKey: ['learningPlatform', 'modules'],
    enabled,
    initialData: readJsonCacheSync('learningPlatform-modules.cache.json'),
  });
};

const query = `query modules($pagination: OffsetPaginationInput!) {
  modules(pagination: $pagination) {
    title
    shortCode
    moduleIdentifier
    simpleShortCode
    department {
      abbreviation
    }
    content
    qualificationGoals
    ects
    contactTime
    selfStudyTime
    weeklyHours
    graded
    retired
    coordinator {
      name
    }
    prerequisites {
      id
    }
    prerequisiteFor {
      id
    }
    replacements {
        id
    }
    replacementFor {
        id
    }
    semesterModules {
      allowsRegistration
      semester {
        isActive
      }
      isDraft
      hasDuplicate
      status
    }
    workload
    id
    createdAt
    updatedAt
  }
}`;
