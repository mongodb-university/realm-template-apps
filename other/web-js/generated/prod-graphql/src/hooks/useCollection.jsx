import React from "react";
import { useApp } from "../components/RealmApp";

/**
 * Returns a MongoDB Collection client object
 * @template DocType extends Realm.Services.MongoDB.Document
 * @param {Object} config - A description of the collection.
 * @param {string} [config.cluster] - The service name of the collection's linked cluster.
 * @param {string} config.db - The name of database that contains the collection.
 * @param {string} config.collection - The name of the collection.
 * @returns {Realm.Services.MongoDB.MongoDBCollection<DocType>} config.collection - The name of the collection.
 */
export function useCollection({ cluster = "mongodb-atlas", db, collection }) {
  const app = useApp();
  return React.useMemo(() => {
    const mdb = app.currentUser.mongoClient(cluster);
    return mdb.db(db).collection(collection);
  }, [app.currentUser, cluster, db, collection]);
}
