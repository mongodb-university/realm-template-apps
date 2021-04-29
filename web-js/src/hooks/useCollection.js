import React from "react";
import { useRealmApp } from "../components/RealmApp";

/**
 * Returns a MongoDB Collection client object
 * @param {Object} config - A description of the collection.
 * @param {string} config.service - The service name of the collection's linked cluster.
 * @param {string} config.db - The name of database that contains the collection.
 * @param {string} config.collection - The name of the collection.
 */
export function useCollection({ service="mongodb-atlas", db, collection }) {
  const realmApp = useRealmApp();
  const _collection = React.useMemo(() => {
    const mdb = realmApp.currentUser.mongoClient(service);
    return mdb.db(db).collection(collection);
  }, [realmApp.currentUser, service, db, collection]);
  return _collection
}
