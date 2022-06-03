import Realm from "realm";
import { app } from "./index.js";

/**
  Logs in as the given email/password user. If login fails, attempts to register
  the user then log in.
 */
export const logInOrRegister = async ({ email, password }) => {
  let newUser;
  const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    newUser = await app.logIn(credentials);
    console.log(`Logged in as user ${newUser.id}`);
  } catch {
    newUser = await app.emailPasswordAuth.registerUser({
      email,
      password,
    });
    console.log(`Created new user '${email}'`);
    newUser = await app.logIn(credentials);
    console.log(`Logged in as user '${email}' with ID ${newUser.id}`);
  }
  return newUser;
};
