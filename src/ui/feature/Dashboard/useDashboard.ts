import { useLearningPlatformCurrentSemester } from '../../../services/useLearningPlatform/hooks/useLearningPlatformCurrentSemester.js';
import { useLearningPlatformFollowedProjectUpdates } from '../../../services/useLearningPlatform/hooks/useLearningPlatformFollowedProjectUpdates.js';
import { useLearningPlatformMyModuleData } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyModuleData.js';
import { useLearningPlatformMyProjects } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyProjects.js';
import { useLearningPlatformMyUpcomingAssessments } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyUpcomingAssessments.js';
import { useLearningPlatformMyUpcomingEvents } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyUpcomingEvents.js';
import { useLearningPlatformSemesterModuleCard } from '../../../services/useLearningPlatform/hooks/useLearningPlatformSemesterModuleCard.js';
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
    myModuleData: {
      isLoading: myModuleData.isLoading,
      isError: myModuleData.isLoadingError,
      data: myModuleData.data?.myModuleData,
    },
    myProjects: {
      isLoading: myProjects.isLoading,
      isError: myProjects.isLoadingError,
      data: myProjects.data?.myProjects,
    },
    importantSemesterDates: {
      isLoading: importantSemesterDates.isLoading,
      isError: importantSemesterDates.isLoadingError,
      data: importantSemesterDates.data?.currentSemester
        ?.importantSemesterDates,
    },
    followedProjectUpdates: {
      isLoading: followedProjectUpdates.isLoading,
      isError: followedProjectUpdates.isLoadingError,
      data: followedProjectUpdates.data?.followedProjectUpdates,
    },
    mySemesterModules: {
      isLoading: semesterModuleCard.isLoading,
      isError: semesterModuleCard.isLoadingError,
      data: semesterModuleCard.data?.mySemesterModules,
    },
    myUpcomingEvents: {
      isLoading: myUpcomingEvents.isLoading,
      isError: myUpcomingEvents.isLoadingError,
      data: myUpcomingEvents.data?.myUpcomingEvents,
    },
    myUpcomingAssessments: {
      isLoading: myUpcomingAssessments.isLoading,
      isError: myUpcomingAssessments.isLoadingError,
      data: myUpcomingAssessments.data?.myUpcomingAssessments,
    },
    breadcrumbsProps: {
      isLoading: queries.some((i) => i.isFetching),
      isError: queries.some((i) => i.isError),
    },
  };
}
