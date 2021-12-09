/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  app as electronApp,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Realm from 'realm';
import { appId } from '../realm.json';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const realmApp = new Realm.App(appId);

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    realmDb?.close();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

ipcMain.handle('get-user-data-path', () => electronApp.getPath('userData'));

let currentUser: Realm.User | null = null;
let realmDb: Realm | null = null;
let realmDbConfig: Realm.Configuration | null = null;

ipcMain.handle('log-in-user', async (_, { username, password }) => {
  console.log('logging in user. creds are', username, password);
  const credentials = Realm.Credentials.emailPassword(username, password);
  try {
    currentUser = await realmApp.logIn(credentials);
    console.log('current user on main is', currentUser.id);
    return true;
  } catch (err) {
    return err;
  }
});

ipcMain.handle(
  'open-realm',
  async (
    _: Electron.IpcMainInvokeEvent,
    config: Realm.Configuration
  ): Promise<boolean | null> => {
    if (!currentUser) {
      console.error('no current user. cannot open realm.');
      return null;
    }
    if (!config?.sync?.user?.id) {
      console.log('opening realm with user', currentUser?.id);
      // @ts-ignore
      config.sync.user = currentUser;
    }
    let res;
    try {
      realmDb = await Realm.open(config);
      realmDbConfig = config;
      console.log('opened realm');
      res = true;
    } catch (err) {
      console.error('error in main process invoking `open-realm`', err);
      res = null;
    }
    return res;
  }
);

ipcMain.handle('close-and-log-out', async () => {
  console.log('close and log out', currentUser?.id, realmDb);
  realmDb?.close();
  await currentUser?.logOut();
  if (realmDbConfig !== null) Realm.deleteFile(realmDbConfig);
  currentUser = null;
  realmDb = null;
  realmDbConfig = null;
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
  realmDb?.close();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
