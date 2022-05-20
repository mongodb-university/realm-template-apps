import Realm from "realm";
import { strict as assert } from "assert";
import * as BSON from "BSON";
import { baseUrl } from "./realm.json";
import { program } from "commander";
import { domainToASCII } from "url";

let app;
let adminDoc1Id;
let adminDoc2Id;
let memberDoc1Id;
let memberDoc2Id;

const ItemSchema = {
  name: "Item",
  properties: {
    _id: "objectId",
    owner_id: "string",
    name: "string",
    collaborators: "string[]",
    team: "string",
  },
  primaryKey: "_id",
};

const logIn = async (email, password) => {
  let newUser;
  const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    newUser = await app.logIn(credentials);
    console.log(`Logged in as user ${newUser.id}`);
  } catch {
    newUser = await app.emailPasswordAuth.registerUser({ email, password });
    console.log(`Created new user ${newUser}`);
    newUser = await app.logIn(credentials);
    console.log(`Logged in as user ${newUser}`);
  }
  return newUser;
};

export const tieredExample = async (appId) => {
  console.log(`Connecting to ${appId}`);
  app = new Realm.App({ id: appId, baseUrl });

  await doAdmin();
  await doMember();
  await canAdminEdit();
  await canMemberEdit();
};

async function doAdmin() {
  console.log("Logging in as Team Admin");
  const admin = await logIn("teamAdmin@foo.bar", "password");

  console.log("Opening synced realm for admin");

  console.log("Adding admin as Admin on team 'foo'");
  const adminFuncArgs = [admin.id, "foo", true];
  let adminFuncResult = await admin.callFunction("joinTeam", adminFuncArgs);
  console.log(adminFuncResult);

  const customadminData = await admin.refreshCustomData();
  console.log(JSON.stringify(customadminData));

  const adminRealm = await Realm.open({
    schema: [ItemSchema],
    sync: {
      user: admin,
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

  const adminItems = adminRealm.objects("Item");
  await adminRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(adminItems);
  });

  console.log("Creating item owned by admin");
  adminRealm.write(() => {
    adminDoc1Id = new BSON.ObjectID();
    adminRealm.create("Item", {
      _id: adminDoc1Id,
      owner_id: admin.id,
      name: "admin created this",
      team: "foo",
    });
  });
  console.log("adminDoc1", adminDoc1Id);

  console.log("Creating another item owned by admin");

  adminRealm.write(() => {
    adminDoc2Id = new BSON.ObjectID();
    adminRealm.create("Item", {
      _id: adminDoc2Id,
      owner_id: admin.id,
      name: "admin created this, too",
      team: "foo",
    });
  });
  console.log("adminDoc2", adminDoc2Id);
  console.log("admin can *read*", adminItems.length, "documents.");

  console.log("Logging out admin");
  app.currentUser.logOut();
  adminRealm.close();
}

async function doMember() {
  console.log("Logging in as user 2");
  const member = await logIn("member@foo.bar", "password");

  console.log("Adding member as member of team 'foo'");
  const funcArgs = [member.id, "foo", false];
  const funcResult = await member.callFunction("joinTeam", funcArgs);
  console.log(funcResult);

  console.log("Opening synced realm for member");
  const memberRealm = await Realm.open({
    schema: [ItemSchema],
    sync: {
      user: member,
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

  await memberRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(memberRealm.objects("Item"));
  });

  console.log("Creating item owned by member");
  memberRealm.write(() => {
    memberDoc1Id = new BSON.ObjectID();
    memberRealm.create("Item", {
      _id: memberDoc1Id,
      owner_id: member.id,
      name: "member created this",
      team: "foo",
    });
  });

  console.log("Creating another item owned by member");

  memberRealm.write(() => {
    memberDoc2Id = new BSON.ObjectID();
    memberRealm.create("Item", {
      _id: memberDoc2Id,
      owner_id: member.id,
      name: "member created this, also",
      team: "foo",
    });
  });

  const memberItems = memberRealm.objects("Item");
  console.log("member can *read*", memberItems.length, "documents.");

  member.logOut();
  memberRealm.close();
}

async function canAdminEdit() {
  console.log("Logging in again as Team Admin");
  const admin = await logIn("teamAdmin@foo.bar", "password");
  const adminRealm = await Realm.open({
    schema: [ItemSchema],
    sync: {
      user: admin,
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

  const adminItems = adminRealm.objects("Item");
  await adminRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(adminItems);
  });
  console.log(adminItems);

  const adminDoc1 = adminRealm.objectForPrimaryKey("Item", adminDoc1Id);
  console.log("Admin is editing Admin doc", adminDoc1._id);
  try {
    adminRealm.write(() => {
      adminDoc1.name += " and Admin edited this!";
    });
  } catch (e) {}

  const memberDoc1 = adminRealm.objectForPrimaryKey("Item", memberDoc1Id);
  console.log("Admin is editing Member doc", memberDoc1._id);
  try {
    adminRealm.write(() => {
      memberDoc1.name += " and Admin edited this!";
    });
  } catch (e) {
    console.log("ERRRORRRR", e);
  }
  console.log(
    "The console should not show an error. Also check server-side " +
      "logs and data. Should have 2 edited docs."
  );

  admin.logOut();
  adminRealm.close();
}

async function canMemberEdit() {
  console.log("Logging in again as Member");
  const member = await logIn("member@foo.bar", "password");

  const memberRealm = await Realm.open({
    schema: [ItemSchema],
    sync: {
      user: member,
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
  const memberItems = memberRealm.objects("Item");
  await memberRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(memberItems);
  });
  console.log(memberItems);

  const adminDoc2 = memberRealm.objectForPrimaryKey("Item", adminDoc2Id);
  console.log("Member is editing Admin doc", adminDoc2);
  try {
    memberRealm.write(() => {
      adminDoc2.name += " and Member edited this!";
    });
  } catch (e) {
    console.error(e);
  }

  const memberDoc2 = memberRealm.objectForPrimaryKey("Item", memberDoc2Id);
  console.log("Member is editing Member doc", memberDoc2._id);
  try {
    memberRealm.write(() => {
      memberDoc2.name += " and Member edited this!";
    });
  } catch (e) {}
  console.log(
    "The console should not show an error. Also check server-side " +
      "logs and data. Should have 1 edited doc."
  );

  member.logOut();
  memberRealm.close();
}
