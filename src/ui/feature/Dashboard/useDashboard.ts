import { useLearningPlatformCurrentSemester } from '../../../services/useLearningPlatform/hooks/useLearningPlatformCurrentSemester.js';
import { useLearningPlatformFollowedProjectUpdates } from '../../../services/useLearningPlatform/hooks/useLearningPlatformFollowedProjectUpdates.js';
import { useLearningPlatformMyModuleData } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyModuleData.js';
import { useLearningPlatformMyProjects } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyProjects.js';
import { useLearningPlatformMyUpcomingAssessments } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyUpcomingAssessments.js';
import { useLearningPlatformMyUpcomingEvents } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyUpcomingEvents.js';
import { useLearningPlatformSemesterModuleCard } from '../../../services/useLearningPlatform/hooks/useLearningPlatformSemesterModuleCard.js';
import { toQueryDto } from '../../util/queryDTO.js';
import { DashboardProps } from './index.js';

export default function useDashboard(): DashboardProps {
  const myModuleData = useLearningPlatformMyModuleData();

  delete myModuleData.data?.myModuleData?.__typename;

  const myProjects = useLearningPlatformMyProjects();

  const importantSemesterDates = useLearningPlatformCurrentSemester();

  const followedProjectUpdates = useLearningPlatformFollowedProjectUpdates();

  const semesterModuleCard = useLearningPlatformSemesterModuleCard();

  const myUpcomingEvents = useLearningPlatformMyUpcomingEvents();

  const myUpcomingAssessments = useLearningPlatformMyUpcomingAssessments();

  const queries = [
    myModuleData,
    myProjects,
    importantSemesterDates,
    followedProjectUpdates,
    semesterModuleCard,
    myUpcomingEvents,
    myUpcomingAssessments,
  ];

  return {
    myModuleData: toQueryDto(myModuleData, myModuleData.data?.myModuleData),
    myProjects: toQueryDto(myProjects, myProjects.data?.myProjects),
    importantSemesterDates: toQueryDto(
      importantSemesterDates,
      importantSemesterDates.data?.currentSemester?.importantSemesterDates
    ),
    followedProjectUpdates: toQueryDto(
      followedProjectUpdates,
      followedProjectUpdates.data?.followedProjectUpdates
    ),
    mySemesterModules: toQueryDto(
      semesterModuleCard,
      semesterModuleCard.data?.mySemesterModules
    ),
    myUpcomingEvents: toQueryDto(
      myUpcomingEvents,
      myUpcomingEvents.data?.myUpcomingEvents
    ),
    myUpcomingAssessments: toQueryDto(
      myUpcomingAssessments,
      myUpcomingAssessments.data?.myUpcomingAssessments
    ),

    breadcrumbsProps: {
      isLoading: queries.some((i) => i.isFetching),
      isError: queries.some((i) => i.isError),
    },
  };
}
