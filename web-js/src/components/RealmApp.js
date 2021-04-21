import React from "react";
import * as Realm from "realm-web";

const RealmAppContext = React.createContext(null);

export function RealmAppProvider({ appId, children }) {
  // Store Realm.App in React state. If appId changes, all children will rerender and use the new realmApp.
  const [realmApp, setRealmApp] = React.useState(new Realm.App(appId));
  React.useEffect(() => {
    setRealmApp(new Realm.App(appId));
  }, [appId]);
  // Store the app's current user in state and wrap the built-in auth functions to modify this state
  const [currentUser, setCurrentUser] = React.useState(realmApp.currentUser);

  const logIn = React.useCallback(
    async (credentials) => {
      await realmApp.logIn(credentials);
      setCurrentUser(realmApp.currentUser);
    },
    [realmApp]
  );

  const logOut = React.useCallback(async () => {
    await currentUser?.logOut();
    setCurrentUser(realmApp.currentUser);
  }, [currentUser, realmApp.currentUser]);

  return (
    <RealmAppContext.Provider
      value={{ ...realmApp, currentUser, logIn, logOut }}
    >
      {children}
    </RealmAppContext.Provider>
  );
}

export function useRealmApp() {
  return React.useContext(RealmAppContext);
}
