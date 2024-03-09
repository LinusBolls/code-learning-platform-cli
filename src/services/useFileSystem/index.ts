import fs from 'fs';
import { join } from 'path';

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

async function initAppDataDir() {
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
    fs.mkdirSync(cachePath, { recursive: true });

    fs.writeFileSync(configFilePath, JSON.stringify({}), {
      flag: 'wx',
    });
  }
}

async function readAuthConfigFile() {
  const sache = await fs.promises.readFile(configFilePath, 'utf8');

  const authConfig = JSON.parse(sache);

  return authConfig;
}

async function writeAuthConfigFile(contents: any) {
  await fs.promises.writeFile(configFilePath, JSON.stringify(contents));
}

function readJsonCacheSync<T>(fileName: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(join(cachePath, fileName), 'utf8'));
  } catch (err) {
    return null;
  }
}
function writeJsonCacheSync(fileName: string, data: unknown) {
  fs.writeFileSync(join(cachePath, fileName), JSON.stringify(data), {
    flag: 'w',
  });
}

export function useFileSystem() {
  initAppDataDir();

  return {
    readJsonCacheSync,
    writeJsonCacheSync,

    readAuthConfigFile,
    writeAuthConfigFile,
  };
}
