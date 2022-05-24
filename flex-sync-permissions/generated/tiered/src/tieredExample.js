import Realm from "realm";
import * as BSON from "BSON";

let app;
let adminDoc1Id;
let adminDoc2Id;
let memberDoc1Id;
let memberDoc2Id;
const realmTeamAdminAccount = {
  email: "teamRealmAdmin@foo.bar",
  password: "password",
};
const atlasTeamAdminAccount = {
  email: "teamAtlasAdmin@foo.bar",
  password: "password",
};
const realmTeamMemberAccount = {
  email: "teamRealmMember@foo.bar",
  password: "password",
};

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

const logIn = async (props) => {
  let newUser;
  const credentials = Realm.Credentials.emailPassword(
    props.email,
    props.password
  );
  try {
    newUser = await app.logIn(credentials);
    console.log(`Logged in as user ${newUser.id}`);
  } catch {
    newUser = await app.emailPasswordAuth.registerUser({
      email: props.email,
      password: props.password,
    });
    console.log(`Created new user ${newUser}`);
    newUser = await app.logIn(credentials);
    console.log(`Logged in as user ${newUser}`);
  }
  return newUser;
};

const getRealm = async (user) => {
  return Realm.open({
    schema: [ItemSchema],
    sync: {
      user: user,
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
};

export const tieredExample = async (appId, baseUrl) => {
  console.log(`Connecting to ${appId}`);
  app = new Realm.App({ id: appId, baseUrl });

  await setUpTeamRealmAdmin();
  await setUpTeamRealmMember();
  await setUpTeamAtlasAdmin();
  await canAdminEdit();
  await canMemberEdit();
};

const setUpTeamRealmAdmin = async () => {
  console.log("Logging in as Team 'TeamRealm' Admin");
  const admin = await logIn(realmTeamAdminAccount);

  console.log("Opening synced realm for admin");

  console.log("Adding admin as Admin on team 'realmTeam'");
  const adminFuncArgs = [admin.id, "realmTeam", true];
  let adminFuncResult = await admin.callFunction("joinTeam", adminFuncArgs);
  console.log(adminFuncResult);

  const customadminData = await admin.refreshCustomData();
  console.log(JSON.stringify(customadminData));

  const adminRealm = await getRealm(admin);

  const adminItems = adminRealm.objects("Item");
  await adminRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(adminItems);
  });

  console.log("Creating item owned by TeamRealm Admin");
  adminRealm.write(() => {
    adminDoc1Id = new BSON.ObjectID();
    adminRealm.create("Item", {
      _id: adminDoc1Id,
      owner_id: admin.id,
      name: "TeamRealm Admin created this",
      team: "realmTeam",
    });
  });

  console.log("Creating another item owned by TeamRealm Admin");
  adminRealm.write(() => {
    adminDoc2Id = new BSON.ObjectID();
    adminRealm.create("Item", {
      _id: adminDoc2Id,
      owner_id: admin.id,
      name: "TeamRealm Admin created this, too",
      team: "realmTeam",
    });
  });

  console.log("Logging out admin");
  app.currentUser.logOut();

  adminRealm.close();
};

const setUpTeamRealmMember = async () => {
  console.log("Logging in as a Member of team 'TeamRealm'");
  const member = await logIn(realmTeamMemberAccount);

  console.log("Adding member as member of team 'realmTeam'");
  const funcArgs = [member.id, "realmTeam", false];
  const funcResult = await member.callFunction("joinTeam", funcArgs);
  console.log(funcResult);

  console.log("Opening synced realm for member");
  const memberRealm = await getRealm(member);

  await memberRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(memberRealm.objects("Item"));
  });

  console.log("Creating item owned by member");
  memberRealm.write(() => {
    memberDoc1Id = new BSON.ObjectID();
    memberRealm.create("Item", {
      _id: memberDoc1Id,
      owner_id: member.id,
      name: "TeamRealm Member created this",
      team: "realmTeam",
    });
  });

  console.log("Creating another item owned by member");
  memberRealm.write(() => {
    memberDoc2Id = new BSON.ObjectID();
    memberRealm.create("Item", {
      _id: memberDoc2Id,
      owner_id: member.id,
      name: "TeamRealm Member created this, too",
      team: "realmTeam",
    });
  });

  member.logOut();
  memberRealm.close();
};

const setUpTeamAtlasAdmin = async () => {
  console.log("Logging in as Team 'AtlasTeam' Admin");
  const atlasTeamAdmin = await logIn(atlasTeamAdminAccount);

  console.log("Adding admin as Admin on team 'atlasTeam'");
  const adminFuncArgs = [atlasTeamAdmin.id, "atlasTeam", true];
  let adminFuncResult = await atlasTeamAdmin.callFunction(
    "joinTeam",
    adminFuncArgs
  );
  console.log(adminFuncResult);

  const customadminData = await atlasTeamAdmin.refreshCustomData();
  console.log(JSON.stringify(customadminData));

  console.log("Opening synced realm for admin");
  const adminAtlasTeamRealm = await getRealm(atlasTeamAdmin);

  const adminItems = adminAtlasTeamRealm.objects("Item");
  await adminAtlasTeamRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(adminItems);
  });

  console.log("Creating item owned by AtlasTeam Admin");
  adminAtlasTeamRealm.write(() => {
    adminAtlasTeamRealm.create("Item", {
      _id: new BSON.ObjectID(),
      owner_id: atlasTeamAdmin.id,
      name: "AtlasTeam Admin created this",
      team: "atlasTeam",
    });
  });
  console.log("Logging out 'AtlasTeam' Admin");
  app.currentUser.logOut();
  adminAtlasTeamRealm.close();
};

const canAdminEdit = async () => {
  console.log("Logging in again as TeamRealm Admin");
  const admin = await logIn(realmTeamAdminAccount);

  const adminRealm = await getRealm(admin);

  let adminItems = adminRealm.objects("Item");
  await adminRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(adminItems);
  });

  await adminRealm.subscriptions.waitForSynchronization();
  adminItems = adminRealm.objects("Item");
  console.log("TeamRealm's Admin can read the following documents:");

  adminItems.forEach((element) => {
    console.log(JSON.stringify(element));
  });
  const adminDoc1 = adminRealm.objectForPrimaryKey("Item", adminDoc1Id);

  console.log("TeamRealm Admin is editing TeamRealm Admin doc", adminDoc1._id);
  try {
    adminRealm.write(() => {
      adminDoc1.name += ", and TeamRealm Admin edited it!";
    });
  } catch (e) {
    console.error(e);
  }
  console.log(memberDoc1Id);
  const memberDoc1 = adminRealm.objectForPrimaryKey("Item", memberDoc1Id);
  console.log(memberDoc1);
  console.log(
    "TeamRealm Admin is editing TeamRealm Member doc",
    memberDoc1._id
  );
  try {
    adminRealm.write(() => {
      memberDoc1.name += ", and TeamRealm Admin edited it!";
    });
  } catch {
    console.error(e);
  }

  admin.logOut();
  adminRealm.close();
};

const canMemberEdit = async () => {
  console.log("Logging in again as TeamRealm Member");
  const member = await logIn(realmTeamMemberAccount);

  const memberRealm = await getRealm(member);

  const memberItems = memberRealm.objects("Item");
  await memberRealm.subscriptions.update((mutableSubs) => {
    mutableSubs.add(memberItems);
  });
  console.log("TeamRealm's Member can read the following documents:");

  memberItems.forEach((element) => {
    console.log(JSON.stringify(element));
  });

  const memberDoc2 = memberRealm.objectForPrimaryKey("Item", memberDoc2Id);
  console.log(
    "TeamRealm Member is editing TeamRealm Member doc",
    memberDoc2._id
  );
  try {
    memberRealm.write(() => {
      memberDoc2.name += ", and TeamRealm Member edited it!";
    });
  } catch (e) {
    console.error(e);
  }

  const adminDoc2 = memberRealm.objectForPrimaryKey("Item", adminDoc2Id);
  console.log("Member is editing TeamRealm Admin doc", adminDoc2);
  try {
    memberRealm.write(() => {
      adminDoc2.name += ", and TeamRealm Member edited it!";
    });
  } catch (e) {
    console.error(e);
  }

  console.log(
    "The console should show a message when failing to edit the Admin document." +
      "There should be 1 edited doc."
  );

  member.logOut();
  memberRealm.close();
};
