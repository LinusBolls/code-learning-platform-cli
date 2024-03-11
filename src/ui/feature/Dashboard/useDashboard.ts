import {
  useLearningPlatformImportantSemesterDates,
  useLearningPlatformMyModuleData,
  useLearningPlatformMyProjects,
} from '../../../services/useLearningPlatform/index.js';

export default function useDashboard() {
  const myModuleData = useLearningPlatformMyModuleData();

  delete myModuleData.data?.myModuleData.__typename;

  const myProjects = useLearningPlatformMyProjects();

  const importantSemesterDates = useLearningPlatformImportantSemesterDates();

  const queries = [myModuleData, myProjects, importantSemesterDates];

  return {
    ectsData: myModuleData.data?.myModuleData,
    myProjects: myProjects.data?.myProjects,
    importantSemesterDates:
      importantSemesterDates.data?.currentSemester.importantSemesterDates,
    breadcrumbsProps: {
      isLoading: queries.some((i) => i.isFetching),
      isError: queries.some((i) => i.isError),
    },
  };
}
