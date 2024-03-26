#include "auth_manager.hpp"

AuthManager::AuthManager(Delegate *delegate, realm::App *app): _delegate(delegate), _app(app) {  }

void AuthManager::registerUser(std::string const& userEmail, std::string const& userPassword) {
  _app->register_user(userEmail, userPassword).get();
  logIn(userEmail, userPassword);
}

void AuthManager::logIn(std::string const& userEmail, std::string const& userPassword) {
  _app->login(
          realm::App::credentials::username_password(userEmail, userPassword))
      .get();
  _delegate->onLoggedIn();
}

void AuthManager::logOut() {
  auto currentUser = _app->get_current_user();
  currentUser->log_out().get();
  _delegate->onLoggedOut();
}