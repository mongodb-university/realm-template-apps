#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../app_state.hpp"

class LoginController final : public Controller {
 private:
  AppState *_appState{nullptr};

  struct LoginViewState {
    bool isLoggingIn{false};
  } state;

 public:
  //LoginController(AppState *appState);
  LoginController(AppState *appState): Controller(ftxui::Container::Vertical({
    ftxui::Button("Log in", [this] {
      _appState->authManager->logIn();
    }),
    ftxui::Button("Sign up", [this] {
      _appState->authManager->logIn();
    })
  })), _appState(appState) {}
};