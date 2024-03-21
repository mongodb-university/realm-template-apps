#pragma once

class AuthManager {
 public:
  struct Delegate {
    virtual ~Delegate() = default;
    virtual void onLoggedIn() = 0;
    virtual void onLoggedOut() = 0;
  };

  AuthManager(Delegate *delegate): _delegate(delegate) {}

  void logIn() {
    // ... background ...
    _delegate->onLoggedIn();
  }

  void logOut() {
    _delegate->onLoggedOut();
  }

 private:
  Delegate *_delegate{nullptr};
};