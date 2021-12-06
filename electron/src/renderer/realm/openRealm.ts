import Realm from 'realm';
import { Car } from 'schemas';
import { ipcRenderer } from 'electron';
import path from 'path';
import { cloneDeep } from 'lodash';
import app from './realmApp';
import Authentication from './Authentication';

async function getUserDataPath() {
  const userDataPath = await ipcRenderer.invoke('get-user-data-path');
  return userDataPath;
}

async function openRealm(): Promise<Realm | undefined> {
  await Authentication.logIn();
  const userDataPath = await getUserDataPath();
  console.log('curr user', app.currentUser);
  const userClone = cloneDeep(app.currentUser);
  console.log('user clone', userClone);
  const config = {
    schema: [Car], // predefined schema
    path: path.join(userDataPath, 'my.realm'),
    sync: {
      user: userClone, // TODO: this isn't being passed to main process properly.
      partitionValue: app.currentUser?.id,
    },
  };

  try {
    const res = await ipcRenderer.invoke('open-realm', config);
    console.log('res from main is...', res);
    if (res) {
      const rendererConfig = { ...config, sync: true };
      // @ts-ignore
      const realm = new Realm(rendererConfig);
      return realm;
    } else throw new Error("couldn't communicate with main");
  } catch (err) {
    if (err instanceof Error) {
      console.error('failed to open realm', err.message);
    }
    return;
  }
}

export default openRealm;
