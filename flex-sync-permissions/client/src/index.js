import Realm from "realm";
import { appId, baseUrl } from "./realm.json";
export const app = new Realm.App({ id: appId, baseUrl });
// :state-start: add-collaborators
import { addCollaboratorsExample } from "./addCollaboratorsExample.js";
addCollaboratorsExample().then(() => process.exit(0));
// :state-end:
// :state-start: tiered
import { tieredExample } from "./tieredExample.js";
tieredExample().then(() => process.exit(0));
// :state-end:
// :state-start: restricted-feed
import { restrictedFeedExample } from "./restrictedFeedExample.js";
restrictedFeedExample().then(() => process.exit(0));
// :state-end:
