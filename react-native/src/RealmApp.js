import Realm from 'realm';
import {appId, baseUrl} from '../realm';

if (!appId) {
  throw 'Missing Realm App ID. Set appId in realm.json';
}
if (!baseUrl) {
  throw 'Missing Realm base URL. Set baseUrl in realm.json';
}

const appConfiguration = {
  id: appId,
  baseUrl,
};

export const realmApp = new Realm.App(appConfiguration);
