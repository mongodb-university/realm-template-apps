#include "auth_manager.hpp"

AuthManager::AuthManager(Delegate *delegate, realm::App *app, ErrorManager *errorManager): _delegate(delegate), _app(app), _errorManager(errorManager) {  }

void AuthManager::registerUser(std::string const& userEmail, std::string const& userPassword) {
  try {
    _app->register_user(userEmail, userPassword).get();
    logIn(userEmail, userPassword);
  } catch(realm::app_error const &error) {
    auto errorText = SS("An error occurred while registering a user. Message: " << error.message() << std::endl);
    _errorManager->setError(errorText);
  }
}

void AuthManager::logIn(std::string const& userEmail, std::string const& userPassword) {
  try {
    _app->login(
            realm::App::credentials::username_password(userEmail, userPassword))
        .get();
    _delegate->onLoggedIn();
  } catch(realm::app_error const &error) {
    auto errorText = SS("An error occurred while logging in. Message: " << error.message() << std::endl);
    _errorManager->setError(errorText);
  }
}

void AuthManager::logOut() {
  try {
    auto currentUser = _app->get_current_user();
    currentUser->log_out().get();
    _delegate->onLoggedOut();
  } catch(realm::app_error const &error) {
    auto errorText = SS("An app error occurred. Message: " << error.message() << std::endl);
    _errorManager->setError(errorText);
  }
}