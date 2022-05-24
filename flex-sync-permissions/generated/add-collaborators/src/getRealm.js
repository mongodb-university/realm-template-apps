import Realm from "realm";

/**
  Opens a flexible sync realm for the given user with the given schema.
 */
export const getRealm = async ({ user, schema }) => {
  return await Realm.open({
    schema,
    sync: {
      user,
      flexible: true,
      error: (session, error) => {
        console.error("Is connected:", session.isConnected());
        console.error("Sync Error:", error);
      },
      clientReset: {
        mode: "manual",
      },
    },
  });
};
