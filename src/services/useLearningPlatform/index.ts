import {
  LearningPlatformClient,
  LearningPlatformClientOptions,
  LearningPlatformClientType,
} from 'code-university';
import fs from 'fs';
import { join } from 'path';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { create } from 'zustand';

import { useFileSystem } from '../useFileSystem/index.js';

interface LearningPlatformStore {
  client: LearningPlatformClientType | null;
  hasAttemptedSessionLoad: boolean;
  isLoadingSession: boolean;
  actions: {
    startLoadingSession: () => void;
    finishLoadingSession: (client: LearningPlatformClientType) => void;
    signOut: () => void;
    abortLoadingSession: () => void;
  };
}

const useLearningPlatformStore = create<LearningPlatformStore>((set) => ({
  client: null,
  isLoadingSession: true,
  hasAttemptedSessionLoad: false,
  actions: {
    startLoadingSession: () =>
      set({
        client: null,
        isLoadingSession: true,
        hasAttemptedSessionLoad: true,
      }),
    finishLoadingSession: (client: LearningPlatformClientType) =>
      set({ client, isLoadingSession: false }),
    signOut: () => set({ client: null, isLoadingSession: false }),
    abortLoadingSession: () =>
      set({
        client: null,
        isLoadingSession: false,
      }),
  },
}));

export interface AsyncStorage {
  getItemAsync: (key: string) => Promise<string | null>;
  setItemAsync: (key: string, value: string) => Promise<void>;
  deleteItemAsync: (key: string) => Promise<void>;
}

export interface UseLearningPlatformOptions {
  /** defaults to learningPlatform:session */
  storageKey?: string;
  /** defaults to 'expo-secure-store' */
  asyncStorage?: AsyncStorage;
  /** the option to get passed into 'code-university's `LearningPlatformClient` */
  clientOptions?: LearningPlatformClientOptions;
}

function getUserDataPath() {
  return (
    process.env['APPDATA'] ||
    (process.platform === 'darwin'
      ? process.env['HOME'] + '/Library/Application Support'
      : process.env['HOME'] + '/.local/share')
  );
}

const appDataPath = join(getUserDataPath(), 'code-learning-platform-cli');

const cachePath = join(appDataPath, 'cache');

const configFilePath = join(appDataPath, 'auth.json');

const fileSystemAsyncStorage: AsyncStorage = {
  getItemAsync: async (key: string) => {
    if (!fs.existsSync(appDataPath)) {
      fs.mkdirSync(appDataPath, { recursive: true });
      fs.mkdirSync(cachePath, { recursive: true });

      fs.writeFileSync(configFilePath, JSON.stringify({}), {
        flag: 'wx',
      });
    }
    const sache = await fs.promises.readFile(configFilePath, 'utf8');

    const authConfig = JSON.parse(sache);

    return authConfig[key];
  },
  setItemAsync: async (key: string, value: string) => {
    if (!fs.existsSync(appDataPath)) {
      fs.mkdirSync(appDataPath, { recursive: true });
      fs.mkdirSync(cachePath, { recursive: true });

      fs.writeFileSync(configFilePath, JSON.stringify({}), {
        flag: 'wx',
      });
    }
    const sache = await fs.promises.readFile(configFilePath, 'utf8');

    const authConfig = JSON.parse(sache);

    authConfig[key] = value;

    await fs.promises.writeFile(configFilePath, JSON.stringify(authConfig));
  },
  deleteItemAsync: async (key: string) => {
    if (!fs.existsSync(appDataPath)) {
      fs.mkdirSync(appDataPath, { recursive: true });
      fs.mkdirSync(cachePath, { recursive: true });

      fs.writeFileSync(configFilePath, JSON.stringify({}), {
        flag: 'wx',
      });
    }
    const sache = await fs.promises.readFile(configFilePath, 'utf8');

    const authConfig = JSON.parse(sache);

    delete authConfig[key];

    await fs.promises.writeFile(configFilePath, JSON.stringify(authConfig));
  },
};

/**
 * automatically persists the session.
 */
export const useLearningPlatform = (options?: UseLearningPlatformOptions) => {
  const asyncStorage = options?.asyncStorage || fileSystemAsyncStorage;
  const storageKey = options?.storageKey || 'learningPlatform:session';

  const store = useLearningPlatformStore();

  const isAuthenticated = store.client != null;
  const isUnderMaintanance = false;
  const noNetwork = false;
  const isDown = noNetwork || isUnderMaintanance;
  const isLoadingSession = store.isLoadingSession;

  async function signInWithAccessToken(accessToken: string) {
    store.actions.startLoadingSession();

    const client = await LearningPlatformClient.fromAccessToken(
      accessToken,
      options?.clientOptions
    );
    store.actions.finishLoadingSession(client);

    const storageValue = JSON.stringify({
      accessToken,
    });
    await asyncStorage.setItemAsync(storageKey, storageValue);
  }

  async function loadSessionFromStorage() {
    try {
      const storageValue = await asyncStorage.getItemAsync(storageKey);
      if (storageValue) {
        const session = JSON.parse(storageValue);

        await signInWithAccessToken(session.accessToken);
      } else {
        store.actions.abortLoadingSession();
      }
    } catch (err) {
      console.error(
        'Failed to initialize learning platform session from storage:',
        err
      );
      signOut();
    }
  }

  useEffect(() => {
    if (!store.hasAttemptedSessionLoad) {
      loadSessionFromStorage();
    }
  }, []);

  async function signOut() {
    await asyncStorage.deleteItemAsync(storageKey);

    store.actions.signOut();
  }

  return {
    isLoadingSession,
    /** whether we are authenticated and can make queries */
    enabled: !isDown && isAuthenticated,
    isDown,
    isUnderMaintanance,
    isAuthenticated,
    accessToken: store.client?.accessToken!,
    learningPlatform: store.client!,

    signInWithAccessToken,
    signOut,
  };
};

export const useLearningPlatformModules = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  const { readJsonCacheSync, writeJsonCacheSync } = useFileSystem();

  return useQuery<{ modules: any[] }>(
    ['learningPlatform', 'modules'],
    async () =>
      learningPlatform!.raw.query(`
			query {
				modules {
          title
          shortCode
          moduleIdentifier
          simpleShortCode
          department {
            abbreviation
          }
          content
          qualificationGoals
          ects
          contactTime
          selfStudyTime
          weeklyHours
          graded
          retired



					coordinator {
						name
					}
          prerequisites {
            id
          }
          prerequisiteFor {
            id
          }
          replacements {
              id
          }
          replacementFor {
              id
          }

          
          semesterModules {
            allowsRegistration
            semester {
              isActive
            }
            isDraft
            hasDuplicate
            status
          }
          workload
          id
          createdAt
          updatedAt
				}
			}`),
    {
      enabled,
      initialData: readJsonCacheSync('modules.cache.json'),
      onSuccess(data) {
        writeJsonCacheSync('modules.cache.json', data);
      },
    }
  );
};
