import { useLearningPlatformModules } from '../../../services/useLearningPlatform/index.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { toModuleViewModel } from '../../util/mapping.js';

export default function useModuleInfo(isActive = true) {
  const { moduleId } = useNavigation();

  const modulesQuery = useLearningPlatformModules();

  const rawModule = modulesQuery.data?.modules.find(
    (module) => module.id === moduleId
  );
  if (!rawModule) {
    return {
      isActive,
      module: null,
    };
  }
  const mappedModule = toModuleViewModel(rawModule);

  return {
    module: mappedModule,
  };
}
