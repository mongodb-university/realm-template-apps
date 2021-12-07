import Realm from 'realm';
import app from './realmApp';

class UserAuthentication {
  static async logIn(email, password) {
    const emailPasswordUserCredentials = Realm.Credentials.emailPassword(
      email,
      password
    );
    try {
      const user = await app.logIn(emailPasswordUserCredentials);
      return user;
    } catch (err) {
      return { err, isError: true };
    }
  }

  static async signUp(email, password) {
    try {
      const user = await app.emailPasswordAuth.registerUser({
        email,
        password,
      });
      return user;
    } catch (err) {
      return { err, isError: true };
    }
  }

  static async logOut() {
    await app.currentUser?.logOut();
  }
}

export default UserAuthentication;
