#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../app_state.hpp"

class LoginController final : public Controller {
 private:
  AppState *_appState{nullptr};

  struct LoginViewState {
    bool isLoggingIn{false};
    std::string userEmail{""};
    std::string userPassword{""};
  } state;

 public:
  //LoginController(AppState *appState);
  LoginController(AppState *appState): Controller(ftxui::Container::Vertical({
    ftxui::Button("Log in", [this] {
      _appState->authManager->logIn(_appState->app.get(), state.userEmail, state.userPassword);
    }),
    ftxui::Button("Sign up", [this] {
      _appState->authManager->registerAndLoginUser(_appState->app.get(), state.userEmail, state.userPassword);
    })
  })), _appState(appState) {}
};