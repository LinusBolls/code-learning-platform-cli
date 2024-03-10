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

  return {
    ectsData: myModuleData.data?.myModuleData,
    myProjects: myProjects.data?.myProjects,
    importantSemesterDates:
      importantSemesterDates.data?.currentSemester.importantSemesterDates,
  };
}
