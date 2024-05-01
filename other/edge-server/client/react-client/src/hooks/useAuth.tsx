import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuthContext } from "../providers/AuthProvider";
import { login, logout } from "../endpoints";
import { ObjectId } from "bson";

import { User, EdgeConnectionStatus } from "../types";

export const useAuth = () => {
  const { getItem, setItem } = useLocalStorage();
  const { setUser } = useAuthContext();

  useEffect(() => {
    const localStorageUser = getItem("user");

    if (localStorageUser) {
      addUser(JSON.parse(localStorageUser));
    }
  }, []);

  const loginNoAuth = async (): Promise<EdgeConnectionStatus> => {
    const id = new ObjectId().toString();
    const loginResponse = await login();

    // If connection to Edge Server succeeds, add user
    // to local storage. Otherwise return early with response object.
    if (loginResponse.error || loginResponse?.status == "disconnected") {
      return loginResponse;
    } else {
      addUser({ id });
    }

    return loginResponse;
  };

  const loginWithEmailPassword = async (user: {
    email: string;
    password: string;
  }): Promise<EdgeConnectionStatus> => {
    const loginResponse = await login(user);

    // If connection to Edge Server succeeds, add user
    // to local storage. Otherwise return early with response object.
    if (loginResponse.error || loginResponse?.status == "disconnected") {
      return loginResponse;
    } else {
      addUser({ id: new ObjectId().toString() });
    }

    return loginResponse;
  };

  const logoutAndDisconnect = async (): Promise<EdgeConnectionStatus> => {
    const logoutResult = await logout();

    removeUser();

    return logoutResult;
  };

  const addUser = (newUser: User) => {
    setUser(newUser);
    setItem("user", JSON.stringify(newUser));
  };

  const removeUser = () => {
    setUser(null);
    setItem("user", "");
  };

  return {
    loginNoAuth,
    loginWithEmailPassword,
    logoutAndDisconnect,
  };
};
