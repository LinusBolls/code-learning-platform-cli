import { useQuery } from '@tanstack/react-query';
import { QueryRes } from 'code-university';

import { useFileSystem } from '../../useFileSystem/index.js';
import { useLearningPlatform } from '../index.js';

/**
 * used by the `My ECTS by Module Type` card on the `Dashboard` tab of the Learning Platform
 */
export const useLearningPlatformMyModuleData = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync } = useFileSystem();

  return useQuery<QueryRes<'myModuleData'>>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(
        `query myModuleData {
          myModuleData {
            capstone {
              ...MyECTSStatsData
              __typename
            }
            thesis {
              ...MyECTSStatsData
              __typename
            }
            sts {
              ...MyECTSStatsData
              __typename
            }
            orientation {
              ...MyECTSStatsData
              __typename
            }
            mandatory {
              ...MyECTSStatsData
              __typename
            }
            compulsoryElective {
              ...MyECTSStatsData
              __typename
            }
            elective {
              ...MyECTSStatsData
              __typename
            }
            __typename
          }
        }
        
        fragment MyECTSStatsData on MyECTSStats {
          collectedECTS
          totalECTSNeeded
          __typename
        }`
      );
      return data;
    },
    queryKey: ['learningPlatform', 'myModuleData'],
    enabled,
    initialData: readJsonCacheSync('learningPlatform-myModuleData.cache.json'),
  });
};
