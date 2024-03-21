#pragma once

#include "ftxui/component/component.hpp"
#include "controller.hpp"
#include "../app_state.hpp"

class HomeController final : public Controller {
 private:
  AppState *_appState{nullptr};

 public:
  //HomeController(AppState *appState);
  HomeController(AppState *appState): Controller(ftxui::Container::Vertical({
    ftxui::Button("Log out", [this] {
      _appState->authManager->logOut(_appState->app.get());
    }),
    ftxui::Button("Trigger error", [this] {
      _appState->errorManager->setError("Uh oh!");
    })
  })), _appState(appState) {
  }
};