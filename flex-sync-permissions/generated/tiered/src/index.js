import Realm from "realm";
import { appId, baseUrl } from "./realm.json";
export const app = new Realm.App({ id: appId, baseUrl });
import { tieredExample } from "./tieredExample.js";
tieredExample().then(() => process.exit(0));
