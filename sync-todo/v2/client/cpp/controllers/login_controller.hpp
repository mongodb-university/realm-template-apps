#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../app_state.hpp"

class LoginController final : public Controller {
 private:
  AppState *_appState{nullptr};

  struct LoginViewState {
    bool isLoggingIn{false};
    std::string userEmail;
    std::string userPassword;
  } state;

 public:
  LoginController(AppState *appState);
};