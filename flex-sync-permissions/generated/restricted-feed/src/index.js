import Realm from "realm";
import { appId, baseUrl } from "./realm.json";
export const app = new Realm.App({ id: appId, baseUrl });
import { restrictedFeedExample } from "./restrictedFeedExample.js";
restrictedFeedExample();
