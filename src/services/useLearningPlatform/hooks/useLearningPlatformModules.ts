import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

export const useLearningPlatformModules = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'modules'>>({
    queryFn: async () => {
      // const { moduleHandbooks } = await learningPlatform!.raw.query(`query {
      //   moduleHandbooks {
      //     id
      //     modules {
      //       id
      //     }
      //   }
      // }`);
      // console.log('moduleHandbooks:', moduleHandbooks);

      // const { semesterModules } = await learningPlatform!.raw.query(`query {
      //   semesterModules(moduleHandbookId: "cljwlrnnn422013mjdkdh5wzq") {
      //     id
      //   }
      // }`);

      // console.log('semesterModules:', semesterModules);

      // process.exit(0);

      const { modulesCount } = await learningPlatform!.raw.query(`
        query {
          modulesCount
        }`);
      const modulesPerQuery = 100;

      const numQueries = Math.ceil(modulesCount / modulesPerQuery);

      const queries = await Promise.all(
        Array.from({ length: numQueries }).map((_, idx) =>
          learningPlatform!.raw.query(
            `query {
                modules(pagination: { limit: $limit, offset: $offset }) {
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
              }`,
            { limit: modulesPerQuery, offset: idx * modulesPerQuery }
          )
        )
      );
      return { modules: queries.flatMap((d) => d.modules) };
    },
    queryKey: ['learningPlatform', 'modules'],
    enabled,
    retry: false,
    initialData: readJsonCacheSync('learningPlatform-modules.cache.json'),
  });
};
