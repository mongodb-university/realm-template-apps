import Realm from "realm";
import fs from "fs";

/**
  Opens a flexible sync realm for the given user with the given schema.
 */
export const getRealm = async ({ user, schema }) => {
  const error = async (session, error) => {
    if (error.name !== "ClientReset") {
      console.error("Unhandled sync error:", error);
      return;
    }

    // TODO: Discard local changes and download
  };
  const config = {
    schema,
    sync: {
      user,
      flexible: true,
      clientReset: {
        mode: "manual",
      },
      error,
    },
  };
  return await Realm.open(config);
};
