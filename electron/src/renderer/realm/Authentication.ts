import Realm from 'realm';
import app from './realmApp';

class UserAuthentication {
  static async logIn(): Promise<Realm.User | void> {
    const emailPasswordUserCredentials = Realm.Credentials.emailPassword(
      'benperlmutter96@gmail.com',
      'abc123'
    );
    try {
      const user = await app.logIn(emailPasswordUserCredentials);
      return user;
    } catch (err) {
      console.error('log in error is...', err);
    }
  }

  static async logOut(): Promise<void> {
    await app.currentUser?.logOut();
  }
}

export default UserAuthentication;
