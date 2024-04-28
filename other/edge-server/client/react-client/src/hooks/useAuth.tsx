import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useAuthContext } from "../context/AuthProvider";
import { login, logout } from "../endpoints";
import { ObjectId } from "bson";

import { User } from "../types";

// TODO: Add error handling and general messaging.
export const useAuth = () => {
  const { getItem, setItem } = useLocalStorage();
  const { setUser } = useAuthContext();

  useEffect(() => {
    const localStorageUser = getItem("user");

    if (localStorageUser) {
      addUser(JSON.parse(localStorageUser));
    }
  }, []);

  const loginNoAuth = async () => {
    const id = new ObjectId().toString();
    setTimeout(() => {}, 500);
    await login();

    addUser({ id });
  };

  const loginWithEmailPassword = async (user: {
    email: string;
    password: string;
  }) => {
    await login(user);
    addUser({ id: new ObjectId().toString() });
  };

  const logoutAndDisconnect = async () => {
    const connectionResult = await logout();

    removeUser();

    return connectionResult;
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
