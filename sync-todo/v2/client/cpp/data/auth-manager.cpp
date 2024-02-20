// #include "auth-manager.hpp"

#include <cpprealm/sdk.hpp>
#pragma once

class AuthManager {
 private:
  std::shared_ptr<realm::App> _app;

 public:
  AuthManager(std::shared_ptr<realm::App> app) : _app(app) {}

  void registerAndLoginUser(std::string userEmail, std::string userPassword) {
    _app->register_user(userEmail, userPassword).get();
    loginUser(userEmail, userPassword);
  };

  void loginUser(const std::string userEmail, const std::string userPassword) {
    _app->login(
            realm::App::credentials::username_password(userEmail, userPassword))
        .get();
  };

  void logoutUser() {
    auto currentUser = _app->get_current_user();
    currentUser->log_out().get();
  };
};
