import {
  registerEmailPasswordUser,
  logInEmailPasswordUser,
  refreshSession,
} from "../client-api";

export function useClientApiAuthentication(appId) {
  const [currentUser, setCurrentUser] = React.useState(null);

  const registerUser = useMemo(
    async function ({ email, password }) {
      return await registerEmailPasswordUser({ appId, email, password });
    },
    [appId]
  );

  const logIn = useMemo(
    async function ({ email, password }) {
      const user = await logInEmailPasswordUser({ appId, email, password });
      setCurrentUser(user);
    },
    [appId]
  );

  const logOut = function () {
    setCurrentUser(null);
  };

  const refreshAccessToken = useMemo(
    async function () {
      const { access_token } = await refreshSession({
        appId,
        refresh_token: currentUser?.refresh_token,
      });
      setCurrentUser((prevCurrentUser) => ({
        ...prevCurrentUser,
        access_token,
      }));
    },
    [appId, currentUser]
  );

  return {
    currentUser,
    registerUser,
    logIn,
    logOut,
    refreshAccessToken,
  };
}
