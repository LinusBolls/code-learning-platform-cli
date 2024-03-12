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
const logsPath = join(appDataPath, 'logs');

const configFilePath = join(appDataPath, 'auth.json');

class Logger {
  private logFilePath: string;
  constructor() {
    this.logFilePath = join(logsPath, new Date().toISOString() + '.log.txt');

    this.log('initialized');
  }
  private baseLog(type: string, message: unknown) {
    const messageString =
      typeof message === 'string' ? message : JSON.stringify(message);

    const prefix = new Date().toISOString() + ` ${type}: `;

    fs.appendFileSync(this.logFilePath, prefix + messageString + '\n');
  }
  public log(message: unknown) {
    this.baseLog('LOG', message);
  }
  public warn(message: unknown) {
    this.baseLog('WARNING', message);
  }
  public error(message: unknown) {
    this.baseLog('ERROR', message);
  }
  public debug(message: unknown) {
    this.baseLog('DEBUG', message);
  }
  public info(message: unknown) {
    this.baseLog('INFO', message);
  }
}
export const logger = new Logger();

async function initAppDataDir() {
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
    fs.mkdirSync(cachePath, { recursive: true });
    fs.mkdirSync(logsPath, { recursive: true });

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

export function readJsonCacheSync<T>(fileName: string): T | undefined {
  try {
    return JSON.parse(fs.readFileSync(join(cachePath, fileName), 'utf8'));
  } catch (err) {
    return undefined;
  }
}
export function writeJsonCacheSync(fileName: string, data: unknown) {
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
