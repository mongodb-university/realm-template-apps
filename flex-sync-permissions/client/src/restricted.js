import Realm from "realm";
import * as BSON from "BSON";
import { baseUrl } from "./realm.json";
import fs from 'fs';

let app;
let author1DocAId;
let author1DocBId;
let author2DocAId;
let author2DocBId;
const author1Account = { "email": "author1@foo.bar", "password": "password" };
let author1Id;
const author2Account = { "email": "author2@foo.bar", "password": "password" };

const ItemSchema = {
    name: "Item",
    properties: {
        _id: "objectId",
        owner_id: "string",
        name: "string"
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
        console.log(`Logged in as user ${newUser.id}`);
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
                console.error("Sync Error:", error);
            },
            clientReset: {
                mode: "manual",
                open: Realm.open({
                    schema: [ItemSchema],
                    sync: {
                        user: user,
                        flexible: true,
                    }
                })
            },
        },
    });
};

export const restrictedFeedExample = async (appId) => {
    console.log(`Connecting to ${appId}`);
    app = new Realm.App({ id: appId, baseUrl });

    await setUpAuthor1();
    await setUpAuthor2();
    await canAuthor1ReadAndEdit();
    await canAuthor2ReadAndEdit();
};

const setUpAuthor1 = async () => {

    console.log("Logging in as Author1");
    const author1 = await logIn(author1Account);
    author1Id = author1.id;
    console.log("Opening synced realm for author1");

    const realm1 = await getRealm(author1);

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
            name: "Author1's first item"
        });
    });

    console.log("Creating another item owned by Author1");
    realm1.write(() => {
        author1DocBId = new BSON.ObjectID();
        realm1.create("Item", {
            _id: author1DocBId,
            owner_id: author1.id,
            name: "Author1's second item"
        });
    });

    author1.logOut();
    realm1.close();
}

const setUpAuthor2 = async () => {

    console.log("Logging in as Author2");
    const author2 = await logIn({ email: author2Account.email, password: author2Account.password });
    author2Id = author2.id;

    console.log("Opening synced realm for author1");
    const realm = await getRealm(author2);

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
            name: "Author2's first item"
        });
    });

    console.log("Creating another item owned by Author2");
    realm.write(() => {
        author2DocBId = new BSON.ObjectID();
        realm.create("Item", {
            _id: author2DocBId,
            owner_id: author2.id,
            name: "Author2's second item"
        });
    });

    console.log("Subscribing to Author1's feed.");
    const funcArgs = [author2.id, author1Id];
    author2.callFunction("subscribeToUser", funcArgs);

    author2.logOut();
    realm.close();
}

const canAuthor1ReadAndEdit = async () => {
    console.log("Logging in again as Author1");
    const author1 = await logIn(author1Account);

    const realm = await getRealm(author1)
    let adminItems = realm.objects("Item");

    await realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(adminItems);
    });
    await realm.subscriptions.waitForSynchronization();

    console.log("Author1 can read the following documents:");

    (adminItems).forEach(element => {
        console.log(JSON.stringify(element))
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

    const auth2docA = realm.objectForPrimaryKey("Item", author2DocAId);
    console.log("Author1 is editing Author2's first doc", auth2docA._id);
    try {
        realm.write(() => {
            auth2docA.name += ", and Author1 should not have been able to edit it!";
        });
    } catch {
        console.error(e);
    }

    author1.logOut();
    realm.close();
}

const canAuthor2ReadAndEdit = async () => {
    console.log("Logging in again as Author2");
    const author2 = await logIn(author2Account);

    const realm = await getRealm(author2)
    let adminItems = realm.objects("Item");

    await realm.subscriptions.update((mutableSubs) => {
        mutableSubs.add(adminItems);
    });
    await realm.subscriptions.waitForSynchronization();

    console.log("Author2 can read the following documents:");
    (adminItems).forEach(element => {
        console.log(JSON.stringify(element))
    });
    const auth2DocB = realm.objectForPrimaryKey("Item", author2DocBId);

    console.log("editing", JSON.stringify(auth2DocB));
    console.log("Author2 is editing Author2's second doc", auth2DocB._id);
    try {
        realm.write(() => {
            auth2DocB.name += ", and Author2 edited it!";
        });
    } catch (e) {
        console.error(e);
    }

    const auth1DocB = realm.objectForPrimaryKey("Item", author1DocBId);
    console.log("Author2 is editing Author1's second doc", auth1DocB._id);
    try {
        realm.write(() => {
            auth1DocB.name += ", and Author2 should not have been able to edit it!";
        });
    } catch {
        console.error(e);
    }

    author2.logOut();
    realm.close();
}