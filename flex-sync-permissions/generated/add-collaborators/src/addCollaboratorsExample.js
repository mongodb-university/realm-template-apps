import Realm from "realm";
import { strict as assert } from "assert";
import * as BSON from "BSON";
import { app } from "./index.js";
import { logInOrRegister } from "./logInOrRegister.js";

const ItemSchema = {
  name: "Item",
  properties: {
    _id: "objectId",
    owner_id: "string",
    name: "string",
    collaborators: "string[]",
  },
  primaryKey: "_id",
};

export const addCollaboratorsExample = async () => {
  console.log("Logging in as user 1");
  const user1 = await logInOrRegister({
    email: "user1@example.com",
    password: "password",
  });

  console.log("Logging in as user 2");
  const user2 = await logInOrRegister({
    email: "user1@example.com",
    password: "password",
  });

  console.log("Opening synced realm for user2");
  const realm = await Realm.open({
    schema: [ItemSchema],
    sync: {
      user: user2,
      flexible: true,
      error: (session, error) => {
        console.error("Is connected:", session.isConnected());
        console.error("Error:", error);
      },
      clientReset: {
        mode: "manual",
      },
    },
  });

  console.log("Subscribing to user2's items");
  const user2Items = realm.objects("Item");
  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(user2Items);
  });

  console.log("Creating item with user1 as a collaborator");
  realm.write(() => {
    realm.create("Item", {
      _id: new BSON.ObjectID(),
      owner_id: user2.id,
      name: "first item",
      collaborators: [user1.id],
    });
  });

  console.log("Items:");
  for (const item of user2Items) {
    console.log(JSON.stringify(item));
  }

  console.log("Uploading all local changes and closing the realm");
  await realm.syncSession.uploadAllLocalChanges();
  realm.close();

  console.log("Switching to user1");
  app.switchUser(user1);

  const realm2 = await Realm.open({
    schema: [ItemSchema],
    sync: {
      user: user1,
      flexible: true,
      error: (session, error) => {
        console.error("Is connected:", session.isConnected());
        console.error("Error:", error);
      },
      clientReset: {
        mode: "manual",
      },
    },
  });

  console.log("Subscribing to user1's items");
  const user1Items = realm2.objects("Item");
  await realm2.subscriptions.update((mutableSubs) => {
    mutableSubs.add(user1Items);
  });

  console.log("Items:");
  for (const item of user1Items) {
    console.log(JSON.stringify(item));
  }

  console.log("Making an edit");
  realm2.write(() => {
    const item = user1Items[0];
    assert("It does not belong to user1", item.owner_id !== user1.id);
    item.name = "edited successfully!";
  });

  console.log("Items:");
  for (const item of user1Items) {
    console.log(JSON.stringify(item));
  }

  realm2.close();
};
