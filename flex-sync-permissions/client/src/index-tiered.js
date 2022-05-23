import Realm from "realm";
import { strict as assert } from "assert";
import * as BSON from "BSON";
import { baseUrl } from "./realm.json";
import { program } from "commander";
import { domainToASCII } from "url";
import fs from 'fs';

let app;
let adminDoc1Id;
let adminDoc2Id;
let memberDoc1Id;
let memberDoc2Id;
const fooAdminAccount = { "email": "teamFooAdmin@foo.bar", "password": "password" };
const barAdminAccount = { "email": "teamBarAdmin@foo.bar", "password": "password" };
const fooMemberAccount = { "email": "teamFooMember@foo.bar", "password": "password" };

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
    const credentials = Realm.Credentials.emailPassword(props.email, props.password);
    try {
        newUser = await app.logIn(credentials);
        console.log(`Logged in as user ${newUser.id}`);
    } catch {
        newUser = await app.emailPasswordAuth.registerUser({ email: props.email, password: props.password });
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

export const tieredExample = async (appId) => {
    console.log(`Connecting to ${appId}`);
    app = new Realm.App({ id: appId, baseUrl });

    await setUpFooAdmin();
    await setUpFooMember();
    await setUpBarAdmin();
    await canAdminEdit();
    await canMemberEdit();
};

async function setUpFooAdmin() {
    console.log("Logging in as Team 'Foo' Admin");
    const admin = await logIn(fooAdminAccount);

    console.log("Opening synced realm for admin");

    console.log("Adding admin as Admin on team 'foo'");
    const adminFuncArgs = [admin.id, "foo", true];
    let adminFuncResult = await admin.callFunction("joinTeam", adminFuncArgs);
    console.log(adminFuncResult);

    const customadminData = await admin.refreshCustomData();
    console.log(JSON.stringify(customadminData));

    const adminRealm = await getRealm(admin);

    const adminItems = adminRealm.objects("Item");
    await adminRealm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(adminItems);
    });

    console.log("Creating item owned by Foo Admin");
    adminRealm.write(() => {
        adminDoc1Id = new BSON.ObjectID();
        adminRealm.create("Item", {
            _id: adminDoc1Id,
            owner_id: admin.id,
            name: "Foo Admin created this",
            team: "foo",
        });
    });

    console.log("Creating another item owned by Foo Admin");
    adminRealm.write(() => {
        adminDoc2Id = new BSON.ObjectID();
        adminRealm.create("Item", {
            _id: adminDoc2Id,
            owner_id: admin.id,
            name: "Foo Admin created this, too",
            team: "foo",
        });
    });

    console.log("Logging out admin");
    app.currentUser.logOut();

    adminRealm.close();
}

async function setUpFooMember() {
    console.log("Logging in as a Member of team 'Foo'");
    const member = await logIn(fooMemberAccount);

    console.log("Adding member as member of team 'foo'");
    const funcArgs = [member.id, "foo", false];
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
            name: "Foo member created this",
            team: "foo",
        });
    });

    console.log("Created", memberDoc1Id);

    console.log("Creating another item owned by member");

    memberRealm.write(() => {
        memberDoc2Id = new BSON.ObjectID();
        memberRealm.create("Item", {
            _id: memberDoc2Id,
            owner_id: member.id,
            name: "Foo member created this, too",
            team: "foo",
        });
    });

    member.logOut();
    memberRealm.close();
}

async function setUpBarAdmin() {
    console.log("Logging in as Team 'Bar' Admin");
    const barAdmin = await logIn(barAdminAccount);

    console.log("Opening synced realm for admin");

    console.log("Adding admin as Admin on team 'bar'");
    const adminFuncArgs = [barAdmin.id, "bar", true];
    let adminFuncResult = await barAdmin.callFunction("joinTeam", adminFuncArgs);
    console.log(adminFuncResult);

    const customadminData = await barAdmin.refreshCustomData();
    console.log(JSON.stringify(customadminData));

    const adminBarRealm = await getRealm(barAdmin);

    const adminItems = adminBarRealm.objects("Item");
    await adminBarRealm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(adminItems);
    });

    console.log("Creating item owned by Bar Admin");
    adminBarRealm.write(() => {
        adminBarRealm.create("Item", {
            _id: new BSON.ObjectID(),
            owner_id: barAdmin.id,
            name: "Bar admin created this",
            team: "bar",
        });
    });
    console.log("Logging out 'Bar' admin");
    app.currentUser.logOut();
    adminBarRealm.close();
}

async function canAdminEdit() {

    console.log("Logging in again as Team Admin");
    const admin = await logIn(fooAdminAccount);

    const adminRealm = await Realm.open({
        schema: [ItemSchema],
        sync: {
            user: admin,
            flexible: true,
            error: (session, error) => {
                console.error("Error:", error);
            },
            clientReset: {
                mode: "manual",
            },
        }
    });
    let adminItems = adminRealm.objects("Item");

    await adminRealm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(adminItems);
    });

    await adminRealm.subscriptions.waitForSynchronization();
    adminItems = adminRealm.objects("Item");
    console.log("Foo's Admin can read and edit the following documents:");

    (adminItems).forEach(element => {
        console.log(JSON.stringify(element))
    });
    const adminDoc1 = adminRealm.objectForPrimaryKey("Item", adminDoc1Id);


    console.log("Admin is editing Admin doc", adminDoc1._id);
    try {
        adminRealm.write(() => {
            adminDoc1.name += ", and Foo Admin edited it!";
        });
    } catch (e) {
        console.error(e);
    }
    console.log(memberDoc1Id);
    const memberDoc1 = adminRealm.objectForPrimaryKey("Item", memberDoc1Id);
    console.log(memberDoc1);
    console.log("Admin is editing Member doc", memberDoc1._id);
    try {
        adminRealm.write(() => {
            memberDoc1.name += ", and Foo Admin edited it!";
        });
    } catch {
        console.error(e);
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
    const member = await logIn(fooMemberAccount);

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
    console.log("Foo's Member can read the following documents:");

    (memberItems).forEach(element => {
        console.log(JSON.stringify(element))
    });

    const memberDoc2 = memberRealm.objectForPrimaryKey("Item", memberDoc2Id);
    console.log("Member is editing Member doc", memberDoc2._id);
    try {
        memberRealm.write(() => {
            memberDoc2.name += ", and Foo Member edited it!";
        });
    } catch (e) {
        console.error(e);
    }

    const adminDoc2 = memberRealm.objectForPrimaryKey("Item", adminDoc2Id);
    console.log("Member is editing Admin doc", adminDoc2);
    try {
        memberRealm.write(() => {
            adminDoc2.name += ", and Foo Member edited it!";
        });
    } catch (e) {
        console.error(e);
    }

    console.log(
        "The console should show an error when trying to read the Admin document." +
        "There should be 1 edited doc."
    );

    member.logOut();
    memberRealm.close();
}
