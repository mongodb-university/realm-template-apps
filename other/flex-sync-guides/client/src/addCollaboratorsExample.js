// :state-start: add-collaborators
import Realm from "realm";
import { strict as assert } from "assert";
import { app } from "./index.js";
import { logInOrRegister } from "./logInOrRegister.js";
import { getRealm } from "./getRealm.js";

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
  console.log(`

  addCollaboratorsExample
  -----------------------

  This function demonstrates the "add collaborators" permissions model. 

  The demo logs in as two different users. The first user creates a document and
  adds the second user as a collaborator on that document. The second user then
  logs in and tries to modify that document.

  If permissions are set up correctly, you can expect the following behavior:

  - As a collaborator, the second user's write will successfully sync.
  - If the second user were not added as a collaborator, sync would fail when
    attempting to upload the second user's changes.

`);
  console.log(
    "Logging in as theCollaborator (to ensure there is someone to collaborate with)"
  );
  const theCollaborator = await logInOrRegister({
    email: "theCollaborator@example.com",
    password: "password",
  });

  console.log("Logging in as theAuthor");
  const theAuthor = await logInOrRegister({
    email: "theAuthor@example.com",
    password: "password",
  });

  assert(
    theAuthor.id !== theCollaborator.id,
    "These should not be the same user!"
  );

  console.log("Opening synced realm for theAuthor");
  const realm = await getRealm({
    user: theAuthor,
    schema: [ItemSchema],
  });

  console.log("Subscribing to theAuthor's items");
  const theAuthorItems = realm.objects("Item");
  await realm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(theAuthorItems);
  });

  console.log("Creating item with theCollaborator as a collaborator");
  realm.write(() => {
    realm.deleteAll();
    realm.create("Item", {
      _id: new Realm.BSON.ObjectId(),
      owner_id: theAuthor.id,
      name: "first item",
      collaborators: [theCollaborator.id],
    });
  });

  console.log("Items in realm:");
  printItems(theAuthorItems);

  console.log("Uploading all local changes and closing the realm");
  await realm.syncSession.uploadAllLocalChanges();
  realm.close();

  console.log("Switching to theCollaborator");
  app.switchUser(theCollaborator);


  const realm2 = await getRealm({
    user: theCollaborator,
    schema: [ItemSchema],
  });

  console.log("Subscribing to theCollaborator's items");
  const theCollaboratorItems = realm2.objects("Item");
  await realm2.subscriptions.update((mutableSubs) => {
    mutableSubs.add(theCollaboratorItems);
  });

  console.log("Items:");
  printItems(theCollaboratorItems);

  console.log("Making an edit");
  realm2.write(() => {
    const item = theCollaboratorItems[0];
    assert(
      "It does not belong to theCollaborator",
      item.owner_id !== theCollaborator.id
    );
    item.name = "edited successfully!";
  });

  console.log("Items:");
  printItems(theCollaboratorItems);

  console.log(`
^ Note that the above object now has the name 'edited successfully!' indicating that it was edited successfully locally.
Permissions are not evaluated until a sync attempt is made, so we'll upload the changes now.
`);

  console.log("Uploading all local changes");
  await realm2.syncSession.uploadAllLocalChanges();
  realm2.close();

  console.log(
    "\nIf you're reading this message, the change was accepted by the sync server. No permissions were violated. Success!\n"
  );
};

function printItems(items) {
  for (const item of items) {
    console.log(JSON.stringify(item));
  }
}

// :state-end:
