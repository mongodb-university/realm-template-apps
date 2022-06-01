import 'package:flutter/material.dart';
import 'package:realm/realm.dart';

class AppServices with ChangeNotifier {
  String id;
  App _app;
  User? currentUser;
  AppServices(this.id) : _app = App(AppConfiguration(id));

  Future<User> logInUserEmailPw(String email, String password) async {
    User loggedInUser =
        await _app.logIn(Credentials.emailPassword(email, password));
    currentUser = loggedInUser;
    notifyListeners();
    return loggedInUser;
  }

  Future<User> registerUserEmailPw(String email, String password) async {
    EmailPasswordAuthProvider authProvider = EmailPasswordAuthProvider(_app);
    await authProvider.registerUser(email, password);
    User loggedInUser =
        await _app.logIn(Credentials.emailPassword(email, password));
    currentUser = loggedInUser;
    notifyListeners();
    return loggedInUser;
  }

  Future<void> logOutUser() async {
    await _app.currentUser?.logOut();
    currentUser = null;
    notifyListeners();
  }
}
