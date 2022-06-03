import * as BSON from "BSON";
import { logInOrRegister } from "./logInOrRegister.js";
import { getRealm } from "./getRealm.js";

let author1DocAId;
let author1DocBId;
let author2DocAId;
let author2DocBId;
const author1Account = { email: "author1@example.com", password: "password" };
let author1Id;
let author2Id;
const author2Account = { email: "author2@example.com", password: "password" };

const ItemSchema = {
  name: "Item",
  properties: {
    _id: "objectId",
    owner_id: "string",
    name: "string",
  },
  primaryKey: "_id",
};
const schema = [ItemSchema];

export const restrictedFeedExample = async () => {
  await setUpAuthor1();
  await setUpAuthor2();
  await canAuthor1ReadAndEdit();
  await canAuthor2ReadAndEdit();
};

const setUpAuthor1 = async () => {
  console.log("Logging in as Author1");
  const author1 = await logInOrRegister(author1Account);
  author1Id = author1.id;
  console.log("Opening synced realm for author1");

  const realm1 = await getRealm({ user: author1, schema });

  const author1Items = realm1.objects("Item");
  await realm1.subscriptions.update((mutableSubs) => {
    mutableSubs.add(author1Items);
  });

  console.log("Creating an item owned by Author1");
  realm1.write(() => {
    author1DocAId = new BSON.ObjectID();
    realm1.create("Item", {
      _id: author1DocAId,
      owner_id: author1.id,
      name: "Author1's first item",
    });
  });

  console.log("Creating another item owned by Author1");
  realm1.write(() => {
    author1DocBId = new BSON.ObjectID();
    realm1.create("Item", {
      _id: author1DocBId,
      owner_id: author1.id,
      name: "Author1's second item",
    });
  });

  await realm1.syncSession.uploadAllLocalChanges();
  realm1.close();
  await author1.logOut();
};

const setUpAuthor2 = async () => {
  console.log("Logging in as Author2");
  const author2 = await logInOrRegister({
    email: author2Account.email,
    password: author2Account.password,
  });
  author2Id = author2.id;

  console.log("Opening synced realm for author1");
  const realm = await getRealm({ user: author2, schema });

  const author2Items = realm.objects("Item");
  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(author2Items);
  });

  console.log("Creating an item owned by Author2");
  realm.write(() => {
    author2DocAId = new BSON.ObjectID();
    realm.create("Item", {
      _id: author2DocAId,
      owner_id: author2.id,
      name: "Author2's first item",
    });
  });

  console.log("Creating another item owned by Author2");
  realm.write(() => {
    author2DocBId = new BSON.ObjectID();
    realm.create("Item", {
      _id: author2DocBId,
      owner_id: author2.id,
      name: "Author2's second item",
    });
  });

  console.log("Subscribing to Author1's feed.");

  const result = await author2.callFunction("subscribeToUser", [
    author2Id, author1Account.email,
  ]);
  console.log(`Result: ${JSON.stringify(result)}`);

  await realm.syncSession.uploadAllLocalChanges();
  realm.close();

  await author2.logOut();
};

const canAuthor1ReadAndEdit = async () => {
  console.log("Logging in again as Author1");
  const author1 = await logInOrRegister(author1Account);

  const realm = await getRealm({ user: author1, schema });
  let adminItems = realm.objects("Item");

  console.log("Adding subscription");
  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(adminItems);
  });
  console.log("Syncing... (this might take a while)");
  await realm.subscriptions.waitForSynchronization();

  console.log("Author1 can read the following documents:");

  adminItems.forEach((element) => {
    console.log(JSON.stringify(element));
  });

  const auth1DocA = realm.objectForPrimaryKey("Item", author1DocAId);

  console.log("Author1 is editing Author1's first doc", auth1DocA._id);
  try {
    realm.write(() => {
      auth1DocA.name += ", and Author1 edited it!";
    });
  } catch (e) {
    console.error(e);
  }

  author1.logOut();
  realm.close();
};

const canAuthor2ReadAndEdit = async () => {
  console.log("Logging in again as Author2");
  const author2 = await logInOrRegister(author2Account);

  const realm = await getRealm({ user: author2, schema });
  let adminItems = realm.objects("Item");

  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(adminItems);
  });
  await realm.subscriptions.waitForSynchronization();

  console.log("Author2 can read the following documents:");
  adminItems.forEach((element) => {
    console.log(JSON.stringify(element));
  });

  await author2.logOut();
  realm.close();
};
