import {
  LearningPlatformClient,
  LearningPlatformClientOptions,
  LearningPlatformClientType,
} from 'code-university';
import fs from 'fs';
import { join } from 'path';
import { useEffect } from 'react';
import { create } from 'zustand';

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

  async function signInWithRefreshToken(refreshToken: string) {
    store.actions.startLoadingSession();

    const client = await LearningPlatformClient.fromRefreshToken(
      refreshToken,
      options?.clientOptions
    );
    store.actions.finishLoadingSession(client);

    const storageValue = JSON.stringify({
      refreshToken,
    });
    await asyncStorage.setItemAsync(storageKey, storageValue);
  }

  async function loadSessionFromStorage() {
    try {
      const storageValue = await asyncStorage.getItemAsync(storageKey);
      if (storageValue) {
        const session = JSON.parse(storageValue);

        await signInWithRefreshToken(session.refreshToken);
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
    refreshToken: store.client?.refreshToken!,
    learningPlatform: store.client!,

    signInWithRefreshToken,
    signOut,
  };
};
