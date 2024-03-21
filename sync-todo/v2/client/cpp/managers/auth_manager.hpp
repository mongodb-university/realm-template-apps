#pragma once

#include <cpprealm/sdk.hpp>

class AuthManager {
 public:
  struct Delegate {
    virtual ~Delegate() = default;
    virtual void onRegisteredAndLoggedIn() = 0;
    virtual void onLoggedIn() = 0;
    virtual void onLoggedOut() = 0;
  };

  AuthManager(Delegate *delegate): _delegate(delegate) {  }

  void registerAndLoginUser(realm::App *app, std::string const& userEmail, std::string const& userPassword) {
    app->register_user(userEmail, userPassword).get();
    app->login(
            realm::App::credentials::username_password(userEmail, userPassword))
        .get();
    _delegate->onRegisteredAndLoggedIn();
  }

  void logIn(realm::App *app, std::string const& userEmail, std::string const& userPassword) {
    // ... background ...
    app->login(
            realm::App::credentials::username_password(userEmail, userPassword))
        .get();
    _delegate->onLoggedIn();
  }

  void logOut(realm::App *app) {
    auto currentUser = app->get_current_user();
    currentUser->log_out().get();
    _delegate->onLoggedOut();
  }

 private:
  Delegate *_delegate{nullptr};
};