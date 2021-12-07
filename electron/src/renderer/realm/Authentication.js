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
      console.error('log in error is...', err);
      return null;
    }
  }

  static async logOut() {
    await app.currentUser?.logOut();
  }
}

export default UserAuthentication;
