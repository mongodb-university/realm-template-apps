import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import Realm from 'realm';
import { ipcRenderer } from 'electron';
import path from 'path';
import { Todo } from 'schemas';

function createRealmApp(appId) {
  return new Realm.App(appId);
}

async function getUserDataPath() {
  const userDataPath = await ipcRenderer.invoke('get-user-data-path');
  return userDataPath;
}

async function openRealm(currentUser, schemas) {
  if (!currentUser) return;
  const userDataPath = await getUserDataPath();
  const config = {
    schema: schemas, // predefined schema
    path: path.join(userDataPath, 'my.realm'),
    sync: {
      user: currentUser, // TODO: this isn't being passed to main process properly.
      partitionValue: currentUser?.id,
    },
  };

  try {
    const res = await ipcRenderer.invoke('open-realm', config);
    if (res) {
      const rendererConfig = { ...config, sync: true };
      const realm = new Realm(rendererConfig);
      return realm;
    } else throw new Error("couldn't communicate with main process");
  } catch (err) {
    if (err instanceof Error) {
      console.error('failed to open realm', err.message);
    }
    return null;
  }
}

const RealmAppContext = createContext(null);

function RealmAppProvider({ appId, children }) {
  // Store Realm.App in React state. If appId changes, all children will rerender
  // and use the new realmApp.
  const [realmApp, setRealmApp] = useState(createRealmApp(appId));
  const [realmDb, setRealmDb] = useState(null);

  useEffect(() => {
    setRealmApp(createRealmApp(appId));
  }, [appId]);
  // Store the app's current user in state and wrap the built-in auth functions
  // to modify this state
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (realmApp?.currentUser) {
      console.log('enter initialization use effect w current user');
      console.log(realmApp?.currentUser);
      setCurrentUser(realmApp.currentUser);
      openAndSetRealm(realmApp.currentUser);
    }
  }, [realmApp?.currentUser?.id]);

  // Wrap the base logIn function to save the logged in user in state
  const logIn = useCallback(
    async (username, password) => {
      const credentials = Realm.Credentials.emailPassword(username, password);
      try {
        const user = await realmApp.logIn(credentials);
        console.log(
          'current user in renderer opening realm is ',
          realmApp.currentUser.id
        );
        const res = await ipcRenderer.invoke('log-in-user', {
          username,
          password,
        });
        await openAndSetRealm(user);
        console.log('res from ipc is...', res);
        return true;
      } catch (err) {
        return err;
      }
    },
    [realmApp]
  );

  const openAndSetRealm = async (user) => {
    const realm = await openRealm(user, [Todo]);
    setRealmDb(realm);
    return realm;
  };

  const signUp = useCallback(
    async (username, password) => {
      try {
        await realmApp.emailPasswordAuth.registerUser({
          email: username,
          password,
        });
        await logIn(username, password);
        return true;
      } catch (err) {
        return err;
      }
    },
    [realmApp]
  );

  // Wrap the current user's logOut function to remove the logged out user from state
  const logOut = useCallback(async () => {
    console.log('logging out user in renderer is', currentUser.id);
    realmDb?.close();
    await currentUser?.logOut();
    const res = await ipcRenderer.invoke('close-and-log-out');
    setCurrentUser(null);
    setRealmDb(null);
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
