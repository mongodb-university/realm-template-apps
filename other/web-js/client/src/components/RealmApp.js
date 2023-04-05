import React from "react";
import * as Realm from "realm-web";
import atlasConfig from "../atlasConfig.json";

const { baseUrl } = atlasConfig;

function createApp(id) {
  return new Realm.App({ id, baseUrl });
}

const AppContext = React.createContext(null);

export function AppProvider({ appId, children }) {
  // Store Realm.App in React state. If appId changes, all children will rerender and use the new App.
  const [app, setApp] = React.useState(createApp(appId));
  React.useEffect(() => {
    setApp(createApp(appId));
  }, [appId]);
  // Store the app's current user in state and wrap the built-in auth functions to modify this state
  const [currentUser, setCurrentUser] = React.useState(app.currentUser);
  // Wrap the base logIn function to save the logged in user in state
  const logIn = React.useCallback(
    async (credentials) => {
      await app.logIn(credentials);
      setCurrentUser(app.currentUser);
    },
    [app]
  );
  // Wrap the current user's logOut function to remove the logged out user from state
  const logOut = React.useCallback(async () => {
    try {
      const user = app.currentUser;
      await user?.logOut();
      await app.removeUser(user);
    } catch (err) {
      console.error(err);
    }
    // In this App there will only be one logged in user at a time, so
    // the new current user will be null. If you add support for
    // multiple simultaneous user logins, this updates to another logged
    // in account if one exists.
    setCurrentUser(app.currentUser);
  }, [app]);

  // Override the App's currentUser & logIn properties + include the app-level logout function
  const appContext = React.useMemo(() => {
    return { ...app, currentUser, logIn, logOut };
  }, [app, currentUser, logIn, logOut]);

  return (
    <AppContext.Provider value={appContext}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const app = React.useContext(AppContext);
  if (!app) {
    throw new Error(
      `No App Services App found. Make sure to call useApp() inside of a <AppProvider />.`
    );
  }
  return app;
}
