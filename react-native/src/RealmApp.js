import Realm from 'realm';
import {app_id, base_url} from '../realm';

if (!app_id) {
  throw 'Missing Realm App ID. Set app_id in realm.json';
}
if (!base_url) {
  throw 'Missing Realm base URL. Set base_url in realm.json';
}

const appConfiguration = {
  id: app_id,
  baseUrl: base_url,
};

export const realmApp = new Realm.App(appConfiguration);
