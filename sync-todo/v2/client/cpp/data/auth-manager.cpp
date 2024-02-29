#include "auth-manager.hpp"

AuthManager::AuthManager(std::shared_ptr<realm::App> app) { _app = std::move(app); }

void AuthManager::registerAndLoginUser(std::string const userEmail, std::string const userPassword) {
    _app->register_user(userEmail, userPassword).get();
    loginUser(userEmail, userPassword);
}

void AuthManager::loginUser(std::string const userEmail, std::string const userPassword) {
    _app->login(
            realm::App::credentials::username_password(userEmail, userPassword))
        .get();
}

void AuthManager::logoutUser() {
    auto currentUser = _app->get_current_user();
    currentUser->log_out().get();
}
