import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { logger, useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

export const useLearningPlatformModules = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'currentSemesterModules'>>({
    queryFn: async () => {
      const { currentSemesterModulesCount } = await learningPlatform!.raw
        .query<'currentSemesterModulesCount'>(`
        query {
          currentSemesterModulesCount
        }`);
      const modulesPerQuery = 100;

      const numQueries = Math.ceil(
        currentSemesterModulesCount / modulesPerQuery
      );

      let results = [];

      logger.log(
        `fetching ${currentSemesterModulesCount} modules over ${numQueries} queries`
      );

      for (const idx of Array.from({ length: numQueries }).map(
        (_, idx) => idx
      )) {
        results.push(
          await learningPlatform!.raw.query<'currentSemesterModules'>(query, {
            pagination: {
              limit: modulesPerQuery,
              offset: idx * modulesPerQuery,
            },
            filter: {},
          })
        );
      }
      const currentSemesterModules = results.flatMap(
        (d) => d.currentSemesterModules
      );

      logger.log(`completed modules fetch`);

      return {
        currentSemesterModules: currentSemesterModules as any,
      };
    },
    queryKey: ['learningPlatform', 'modules'],
    enabled,
    initialData: readJsonCacheSync('learningPlatform-modules.cache.json'),
  });
};

const query = `query semesterModuleAllModules($pagination: OffsetPaginationInput, $filter: SemesterModuleFilter) {
  currentSemesterModules(pagination: $pagination, filter: $filter) {
    __typename
    ...SemesterModuleListCard
  }
  coordinatorUsers {
    ...UserListItem
    __typename
  }
  currentSemesterModulesCount(filter: $filter)
}

fragment SemesterModuleListCard on ViewerSemesterModule {
  __typename
  ...TakenSemesterModule
  ...CoordinatedSemesterModule
  ...UnassociatedSemesterModule
}

fragment TakenSemesterModule on ViewerTakenSemesterModule {
  ...SemesterModuleFrame
  status
  highestGrade
  latestAssessment {
    id
    publishedAt
    learningUnit {
      id
      title
      __typename
    }
    __typename
  }
  currentAssessment {
    id
    __typename
  }
  primaryAssessor {
    id
    name
    __typename
  }
  __typename
}

fragment SemesterModuleFrame on ViewerSemesterModule {
  id
  isDraft
  hasDuplicate
  allowsRegistration
  moduleIdentifier
  module {
    id
    title
    shortCode
    simpleShortCode
    retired
    coordinator {
      id
      name
      __typename
    }
    __typename

    # we added these fields
    content
    qualificationGoals
    ects
    contactTime
    selfStudyTime
    weeklyHours
    graded
    workload
    prerequisites {
      id
    }
    prerequisiteFor {
      id
    }
    department {
      # for use in the search
      name
      # to identify the department
      abbreviation
    }
    semesterModules {
      allowsEarlyAssessment
      disabledAlternativeAssessment
    }
    # /we added these fields
  }
  semester {
    id
    name
    isActive
    __typename
  }
  __typename
}

fragment CoordinatedSemesterModule on ViewerCoordinatedSemesterModule {
  ...SemesterModuleFrame
  openProposalsCount
  openAssessmentsCount
  __typename
}

fragment UnassociatedSemesterModule on ViewerSemesterModule {
  ...SemesterModuleFrame
  __typename
}

fragment UserListItem on User {
  id
  firstName
  lastName
  name
  email
  inactive
  role
  slackLink
  skills {
    id
    isHighlighted
    skill {
      name
      __typename
    }
    __typename
  }
  avatarUrl
  __typename
}`;
