import {
  useLearningPlatformImportantSemesterDates,
  useLearningPlatformMyModuleData,
  useLearningPlatformMyProjects,
} from '../../../services/useLearningPlatform/index.js';
import { DashboardProps } from './index.js';

export default function useDashboard(): DashboardProps {
  const myModuleData = useLearningPlatformMyModuleData();

  delete myModuleData.data?.myModuleData.__typename;

  const myProjects = useLearningPlatformMyProjects();

  const importantSemesterDates = useLearningPlatformImportantSemesterDates();

  const queries = [myModuleData, myProjects, importantSemesterDates];

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
      data: importantSemesterDates.data?.currentSemester.importantSemesterDates,
    },
    breadcrumbsProps: {
      isLoading: queries.some((i) => i.isFetching),
      isError: queries.some((i) => i.isError),
    },
  };
}
