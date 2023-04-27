import Realm from "realm";
import fs from "fs";

/**
  Opens a flexible sync realm for the given user with the given schema.
 */
export const getRealm = async ({ user, schema }) => {
  const config = {
    schema,
    sync: {
      user,
      flexible: true,
      clientReset: {
        mode: "manual",
      },
      onError: async (session, error) => {
        switch (error.name) {
          case "ClientReset": {
            // TODO: Discard or merge local changes and re-download the
            // synced data.
            console.error("Client reset error:", error);
            return;
          }
          case "SyncError": {
            // TODO: Handle Sync errors here.
            //
            // For example, you may get a SyncError if the server-side
            // rules reject a client's write operation and send a
            // compensating write to undo the operation locally. You
            // should handle that here and update your UI or other state
            // to reflect the error.
            if(error.code === 231) {
              // Compensating writes use error code 231.
              console.error("Received compensating write:", error);
            } else {
              // For a list of all possible Sync protocol errors, refer to
              // the core Realm Database repository:
              // https://github.com/realm/realm-core/blob/master/doc/protocol.md#error-codes
              console.error("Unhandled sync error:", error);
            }
            return;
          }
          default: {
            console.error("Unhandled sync error:", error);
          }
        }
      },
    },
  };
  return await Realm.open(config);
};
