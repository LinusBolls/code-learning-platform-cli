import { useLearningPlatformCurrentSemester } from '../../../services/useLearningPlatform/hooks/useLearningPlatformCurrentSemester.js';
import { useLearningPlatformFollowedProjectUpdates } from '../../../services/useLearningPlatform/hooks/useLearningPlatformFollowedProjectUpdates.js';
import { useLearningPlatformMyModuleData } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyModuleData.js';
import { useLearningPlatformMyProjects } from '../../../services/useLearningPlatform/hooks/useLearningPlatformMyProjects.js';
import { useLearningPlatformSemesterModuleCard } from '../../../services/useLearningPlatform/hooks/useLearningPlatformSemesterModuleCard.js';
import { DashboardProps } from './index.js';

export default function useDashboard(): DashboardProps {
  const myModuleData = useLearningPlatformMyModuleData();

  delete myModuleData.data?.myModuleData?.__typename;

  const myProjects = useLearningPlatformMyProjects();

  const importantSemesterDates = useLearningPlatformCurrentSemester();

  const followedProjectUpdates = useLearningPlatformFollowedProjectUpdates();

  const semesterModuleCard = useLearningPlatformSemesterModuleCard();

  // TODO: "My upcoming Events", "My upcoming Assessments"

  const queries = [
    myModuleData,
    myProjects,
    importantSemesterDates,
    followedProjectUpdates,
    semesterModuleCard,
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
    breadcrumbsProps: {
      isLoading: queries.some((i) => i.isFetching),
      isError: queries.some((i) => i.isError),
    },
  };
}
