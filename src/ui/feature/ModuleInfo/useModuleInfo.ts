import useInput from '../../../services/useInput/index.js';
import { useLearningPlatformCurrentUser } from '../../../services/useLearningPlatform/hooks/useLearningPlatformCurrentUser.js';
import { useLearningPlatformModules } from '../../../services/useLearningPlatform/hooks/useLearningPlatformModules.js';
import { useNavigation } from '../../../services/useNavigation/index.js';
import { toModuleViewModel } from '../../util/mapping.js';
import { ModuleInfoProps } from './index.js';

export default function useModuleInfo(): ModuleInfoProps {
  const navigation = useNavigation();

  const moduleId = navigation.params['moduleId'] as string;

  const modulesQuery = useLearningPlatformModules();

  const rawModule = modulesQuery.data?.currentSemesterModules?.find(
    (module) => module.id === moduleId
  );
  const currentUserQuery = useLearningPlatformCurrentUser();

  const mandatoryModuleIds = currentUserQuery.data?.me.mandatoryModules ?? [];

  useInput((_, key) => {
    if ((key.tab && key.shift) || key.leftArrow || key.escape) {
      if (navigation.path === 'module') {
        navigation.openPage('modules');
      }
    }
  });

  if (!rawModule) {
    return {
      module: null,
    };
  }
  const mappedModule = toModuleViewModel(mandatoryModuleIds)(rawModule);

  return {
    module: mappedModule,
  };
}
