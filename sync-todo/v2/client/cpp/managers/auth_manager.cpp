#include "auth_manager.hpp"

AuthManager::AuthManager(Delegate *delegate): _delegate(delegate) {  }

void AuthManager::registerUser(realm::App *app, std::string const& userEmail, std::string const& userPassword) {
  app->register_user(userEmail, userPassword).get();
  logIn(app, userEmail, userPassword);
}

void AuthManager::logIn(realm::App *app, std::string const& userEmail, std::string const& userPassword) {
  app->login(
          realm::App::credentials::username_password(userEmail, userPassword))
      .get();
  _delegate->onLoggedIn();
}

void AuthManager::logOut(realm::App *app) {
  auto currentUser = app->get_current_user();
  currentUser->log_out().get();
  _delegate->onLoggedOut();
}