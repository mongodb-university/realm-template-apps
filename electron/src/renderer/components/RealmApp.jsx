import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import Realm from 'realm';

function createRealmApp(appId) {
  return new Realm.App(appId);
}

const RealmAppContext = createContext(null);

function RealmAppProvider({ appId, children }) {
  // Store Realm.App in React state. If appId changes, all children will rerender
  // and use the new realmApp.
  const [realmApp, setRealmApp] = useState(createRealmApp(appId));
  useEffect(() => {
    setRealmApp(createRealmApp(appId));
  }, [appId]);
  // Store the app's current user in state and wrap the built-in auth functions
  // to modify this state
  const [currentUser, setCurrentUser] = useState(realmApp.currentUser);
  // Wrap the base logIn function to save the logged in user in state
  const logIn = useCallback(
    async (username, password) => {
      const credentials = Realm.Credentials.emailPassword(username, password);
      try {
        await realmApp.logIn(credentials);
        setCurrentUser(realmApp.currentUser);
        return true;
      } catch (err) {
        return err;
      }
    },
    [realmApp]
  );

  const signUp = useCallback(
    async (username, password) => {
      try {
        await realmApp.emailPasswordAuth.registerUser({
          email: username,
          password,
        });
        setCurrentUser(realmApp.currentUser);
        return true;
      } catch (err) {
        return err;
      }
    },
    [realmApp]
  );

  // Wrap the current user's logOut function to remove the logged out user from state
  const logOut = useCallback(async () => {
    await currentUser?.logOut();
    await realmApp.removeUser(currentUser);
    setCurrentUser(realmApp.currentUser);
  }, [realmApp, currentUser]);

  // Override the App's currentUser & logIn properties + include the app-level logout function
  const realmAppContext = useMemo(() => {
    return { ...realmApp, currentUser, logIn, logOut, signUp };
  }, [realmApp, currentUser, logIn, logOut, signUp]);

  return (
    <RealmAppContext.Provider value={realmAppContext}>
      {children}
    </RealmAppContext.Provider>
  );
}

export { RealmAppContext, RealmAppProvider };
