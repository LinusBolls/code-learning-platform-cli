import { useLearningPlatformMyModuleData } from '../../../services/useLearningPlatform/index.js';

export default function useDashboard() {
  const query = useLearningPlatformMyModuleData();

  delete query.data?.myModuleData.__typename;

  return {
    ectsData: query.data?.myModuleData,
  };
}
