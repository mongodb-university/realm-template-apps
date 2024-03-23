#pragma once

#include <cpprealm/sdk.hpp>

class AuthManager {
 public:
  struct Delegate {
    virtual ~Delegate() = default;
    virtual void onLoggedIn() = 0;
    virtual void onLoggedOut() = 0;
  };

  AuthManager(Delegate *delegate);

  void registerUser(realm::App *app, std::string const& userEmail, std::string const& userPassword);

  void logIn(realm::App *app, std::string const& userEmail, std::string const& userPassword);

  void logOut(realm::App *app);

 private:
  Delegate *_delegate{nullptr};
};