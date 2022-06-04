// :state-start: restricted-feed
import * as BSON from "BSON";
import { logInOrRegister } from "./logInOrRegister.js";
import { getRealm } from "./getRealm.js";

// Set this to "false" to create new accounts on each run. This guarantees a
// client reset will happen when the permissions get updated.
const reuseAccounts = true;

const makeEmail = (name) => {
  if (reuseAccounts) {
    return `${name}@example.com`;
  }
  return `${name}-${new BSON.ObjectID().toHexString()}@example.com`;
};

const password = "password";
const authorAccount = {
  email: makeEmail("author"),
  password,
};
const subscriberAccount = {
  email: makeEmail("subscriber"),
  password,
};

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
  await setUpAuthor();
  await setUpSubscriber();
  await canSubscriberRead();
};

const setUpAuthor = async () => {
  console.log("Logging in as Author");
  const author = await logInOrRegister(authorAccount);

  console.log("Opening synced realm for author");
  const realm = await getRealm({ user: author, schema });

  const authorItems = realm.objects("Item");
  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(authorItems);
  });

  console.log("Creating items owned by Author");
  realm.write(() => {
    // Cleanup from previous run for demo purposes
    realm.deleteAll();

    realm.create("Item", {
      _id: new BSON.ObjectID(),
      owner_id: author.id,
      name: "Author's first item",
    });
    realm.create("Item", {
      _id: new BSON.ObjectID(),
      owner_id: author.id,
      name: "Author's second item",
    });
  });

  await realm.syncSession.uploadAllLocalChanges();
  realm.close();
  await author.logOut();
};

const setUpSubscriber = async () => {
  console.log("Logging in as Subscriber");
  const subscriber = await logInOrRegister({
    email: subscriberAccount.email,
    password: subscriberAccount.password,
  });

  console.log("Opening synced realm for Subscriber");
  const realm = await getRealm({ user: subscriber, schema });

  const items = realm.objects("Item");
  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(items);
  });

  // Clean up for demo purposes
  const subscriberItems = items.filtered("owner_id == $0", subscriber.id);
  realm.write(() => {
    realm.delete(subscriberItems);
  });

  console.log(
    "Creating items owned by Subscriber. (Everyone can be an author! Getting subscribers of ones own is the hard part.)"
  );
  realm.write(() => {
    realm.create("Item", {
      _id: new BSON.ObjectID(),
      owner_id: subscriber.id,
      name: "Subscriber's first item",
    });
    realm.create("Item", {
      _id: new BSON.ObjectID(),
      owner_id: subscriber.id,
      name: "Subscriber's second item",
    });
  });

  await realm.syncSession.uploadAllLocalChanges();
  realm.close();

  console.log("Subscribing to Author's feed.");
  const result = await subscriber.callFunction("subscribeToUser", [
    authorAccount.email,
  ]);
  console.log(`Remote function call result: ${JSON.stringify(result)}`);

  await subscriber.logOut();
};

const canSubscriberRead = async () => {
  console.log("Logging in again as Subscriber.");
  const subscriber = await logInOrRegister(subscriberAccount);

  console.log(
    "Opening realm. You MUST open a new realm (sync session) for permissions changes to take effect. If the permissions have changed, a client reset will occur."
  );
  const realm = await getRealm({ user: subscriber, schema });

  const items = realm.objects("Item");
  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(items);
  });
  await realm.subscriptions.waitForSynchronization();

  console.log("Subscriber can read the following documents:");
  items.forEach((element) => {
    console.log(JSON.stringify(element));
  });

  console.log(
    "^ If permissions are working, expect to see both Subscriber's items and Author's items."
  );

  await subscriber.logOut();
  realm.close();
};
// :state-end:
