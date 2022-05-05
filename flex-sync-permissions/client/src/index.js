import Realm from "realm";
import * as BSON from "BSON";
import { appId, baseUrl } from "./realm.json";
import Timeout from "await-timeout";
import inquirer from "inquirer";
import cliProgress from "cli-progress";

const ItemSchema = {
  name: "Item",
  properties: {
    _id: "objectId",
    owner_id: "string",
    name: "string",
  },
  primaryKey: "_id",
};

const PP = async () => {
  console.log(`Connecting to ${appId}`);
  const app = new Realm.App({ id: appId, baseUrl });

  const logIn = async () => {
    if (app.currentUser !== undefined) {
      console.log(`Already logged in as user ${app.currentUser.id}`);
      return app.currentUser;
    }
    const credentials = Realm.Credentials.anonymous();
    const newUser = await app.logIn(credentials);
    console.log(`Logged in as new user ${newUser.id}`);
    return newUser;
  };

  console.log("Logging in");
  const user = await logIn();

  console.log("Opening synced realm");
  const realm = await Realm.open({
    schema: [ItemSchema],
    sync: {
      user,
      flexible: true,
      error: (session, error) => {
        console.error("Is connected:", session.isConnected());
        console.error("Error:", error);
      },
    },
  });

  console.log("Subscribing to my items");
  const myItems = realm.objects("Item").filtered("owner_id == $0", user.id);
  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(myItems);
  });

  console.log(`My items:`);
  for (const item of myItems) {
    console.log(`name: ${item.name}, owner: ${item.owner_id}`);
  }

  console.log("Creating item");
  realm.write(() => {
    realm.create("Item", {
      _id: new BSON.ObjectID(),
      owner_id: user.id,
      name: "first item",
    });
  });

  await Timeout.set(10000);

  console.log("Closing realm");
  realm.close();
};

const run = async () => {
  while (true) {
    await inquirer.prompt([
      {
        type: "list",
        name: "action",
        choices: ["log in", "switch user", "create item"],
      },
    ]);
  }
};

run().then(() => process.exit(0));
